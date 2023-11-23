---
layout: post
title: Mastodon comment section on GitHub pages
date: 2023-11-14 06:22
tags:
- python
- mastodon
- comments
- iotreact
- sched
- jekyll
---
So you want a comment section on your blog on [Jekyll](https://jekyllrb.com/) but as it is static you cannot do any server side processing at all and you have to rely on [Disqus](https://ellietheyeen.github.io/2023/11/03/comments-blog-disqus.html) or a similar service. Another thing you can do it make your own comment section using Mastodon since it tends to have a very open API with `Access-Control-Allow-Origin: *` which means that JavaScript in a browser can access the data. This is something that has been done by quite a few like [here](https://www.kylereddoch.me/2023/02/13/adding-mastodon-comments-jekyll-blog.html) and [here](https://yidhra.farm/tech/jekyll/2022/01/03/mastodon-comments-for-jekyll.html) so it is not an entirely new concept but it is a useful one.

So what do we need in order to make such a comment section. The first is we need a Jekyll site, a Mastodon account with an open enough API and some kind of service to connect them together like you can use [GitHub Actions](https://ellietheyeen.github.io/2023/11/06/github-actions-post-on-mastodon.html) to do this but it has a few issue like if you then store the id in the same repository then it might interrupt the pages build and send you an email.

There are a few issues that can come up if you try to post with actions as you do not know what will finish first of the pages build and the posting script. If the posting script posts first then it links a non existing posts where it needs to be posted which breaks the preview and fast users might get a 404. The pages build should optimally finish first but there is no reliable way I have managed to get this to work.

What we do to fix this chicken and egg problem is involve a third thing which is a gist that stores the blog ids and the mastodon ids together so they can be fetched easily for usage in the comment section. Once the gist is fetched we can check what mastodon id corresponds to the post id and fetch the comments from it.

We are using an external thing for this right now even tho GitHub actions could technically be used where we use GitHub hooks. We start with defining a rule in [IOTReact](https://github.com/EllieTheYeen/IOTReact) that will run when we receive a GitHub hook JSON payload.
```py
@listener(channel="aio.githubapphook")
def githubapphook(c, p, m, redis):
    try:
        j = json.loads(m)
    except Exception:
        redis.publish("boterror", f'JSON object not decodable {m!a}')
        return
    action = j.get("action", "push")
    if "repository" not in j or "name" not in j["repository"]:
        redis.publish("junk", f"Github App User {action}")
        return
    repo = j["repository"]["name"]
    redis.publish("junk", f"Github App Repo {repo} {action}")
    if repo == 'ellietheyeen.github.io' and action == 'completed':
        debug = 0
        def fetchblogrss():
            global blogrsstask
            blogrsstask = None
            if debug: redis.publish('junk', 'finally posting')
            os.system("/home/pi/bots/posters/botpost/botpost.py rss")
            if debug: redis.publish('junk', 'finally posted')

        global blogrsstask
        try:
            if blogrsstask:
                scheduler.cancel(blogrsstask)
                if debug: redis.publish('junk', 'Rescheduling')
        except ValueError:
           blogrsstask = None
           #if debug: redis.publish('junk', 'Has already run. Will not reschedule')
           #return
        except NameError:
           pass

        blogrsstask = scheduler.enter(60, 1, fetchblogrss)
```
As you see it waits until 60 seconds after the last complete message has been sent for the repository to prevent race conditions. It then runs a script that runs a RSS posting script through an error handler to be safe which I use for all my bots to log crashes and problems. I also had to write a simple scheduler in IOTReact for this which is shown below.
```py
import threading, time, sched

try:
    scheduler
except Exception:
    scheduler = sched.scheduler(time.monotonic, time.sleep)
    
    def schfunc():
        while True:
            try:
               scheduler.run()
            except Exception:
                import redis
                redis.Redis().publish('boterror', f"IOReact Scheduler\n{traceback.format_exc()}")
            time.sleep(1)

    schedthread = threading.Thread(target=schfunc)
    schedthread.daemon = True
    schedthread.start()
```
The script that is started by this is a [RSS poster](https://ellietheyeen.github.io/2023/10/29/Making-a-simple-RSS-to-Mastodon-poster-powered-by-GitHub-hooks.html) that has quite a bit of new features since last posted about. It does a whole bunch of things like posts on Mastodon, updates the gist, then posts in a Discord channel and finally updated the index in [IndexNow](https://www.bing.com/indexnow). Below is the script that does all these things including parsing the RSS feed that is created by [jekyll-feed](https://github.com/jekyll/jekyll-feed).
```py
def handleblogfeed(doc: bs):
    for d in doc.select("entry"):
        title = d.select("title")[0].text
        url = d.select('link[href^="http"][href$=".html"]')[0].attrs["href"]
        # url = d.select('id')[0].text
        slug = url.split("/", 3)[-1].replace("/", "-").rsplit(".", 1)[0]
        if slug in posts:
            continue
        # Post on Mastodon
        posttext = f"New blog post: {title} {url}"
        print(posttext)
        mast = getmast()
        mastpost = mast.status_post(status=posttext)
        appendpost(slug, mastpost["id"])
        print(mastpost["url"])
        # Update the Mastodon gist
        os.system("/home/pi/bots/posters/rss/updategist.sh")
        # Publish on Discord
        import redis
        r = redis.Redis()
        r.publish("discord.cin.1170179069212631121", f"{url}\n{title}")
        # Publish to IndexNow
        a = {
            "host": "ellietheyeen.github.io",
            "key": "ead23039227a4156b16a573eb69c5981",
            "keyLocation": "https://ellietheyeen.github.io/ead23039227a4156b16a573eb69c5981.txt",
            "urlList": [url],
        }
        r = httpx.post("https://bing.com/IndexNow", json=a)
        print(r.status_code)
        print(r.text)
        exit()
```
This is what is started by the RSS poster and it updates the gist with the ids and matches them together.
```sh
#!/usr/bin/zsh
cd "$(dirname "$0")"
#setopt verbose
#cp posts.csv gistrepo/posts.csv
cd gistrepo
git commit -a -m "$(date +'%Y-%m-%d %H:%M:%S')"
git push origin main
```
The reason for the commented copy is that a symlink is there instead which makes it easier.

Next we have the gist we need to use somehow. Which is here  
<https://gist.github.com/EllieTheYeen/d83b14c225c8233e9c458f9d3889442b>  
We might get some URL like this when we click raw  
`https://gist.githubusercontent.com/EllieTheYeen/d83b14c225c8233e9c458f9d3889442b/raw/9e6fe722b607121523e23aca7150847170257c55/posts.csv`  
But we can correct it like this to always get the latest version  
`https://gist.githubusercontent.com/EllieTheYeen/d83b14c225c8233e9c458f9d3889442b/raw/posts.csv`  
and now we have a gist that is gradually updated and used to store publicly acessible data.

The current content of the gist looks like the following
```csv
MastodonID,BlogSlug
111320221128722260,2023-10-27-blog
111320314417071234,2023-10-29-Making-a-simple-RSS-to-Mastodon-poster-powered-by-GitHub-hooks
111326692329563433,2023-10-30-Previewing-of-3D-models-on-GitHub
111321974892301414,2023-10-30-how-to-create-a-blog-with-jekyll
111356735322459860,2023-10-31-Previewing-of-3D-models-on-GitHub
111337488288194147,2023-11-01-Making-Python-EXE-files-on-Windows
111341045666919235,2023-11-02-Python-sched-module-rescheduling
111344928899231795,2023-11-03-comments-blog-disqus
111349787159729626,2023-11-04-open-graph-tags-seo-social
111355550952162660,2023-11-05-the-mysteries-of-the-webroot
111363797443603161,2023-11-06-github-actions-post-on-mastodon
111374110801724846,2023-11-08-sitemap-using-liquid
111383208702915382,2023-11-09-your-own-search-engine
111386223473577559,2023-11-10-github-profile-and-special-repositories
111393193796204239,2023-11-11-compact-exception-printer
111397820276975795,2023-11-12-useful-command-line-aliases
```
The Mastodon ids are first for easier formatting and readability.

What we have next is a giant mess that actually fetches the gist, fetches the comments and renders them on the page when a button is pressed.
```javascript
{% raw %}
var thisid = "{{ page.id | slice: 1, 999 | replace: '/', '-' }}"
    console.log(thisid)
var load_mastodon = function () {
    fetch("https://gist.githubusercontent.com/EllieTheYeen/d83b14c225c8233e9c458f9d3889442b/raw/posts.csv")
        .then((d) => d.text())
        .then((t) => {
            var thisarticle = null;
            var lines = t.split("\n");
            for (var i = 0; i < lines.length; i++) {
                var a = lines[i].split(",")
                if (a[1] === thisid) {
                    thisarticle = a[0];
                }
            }
            var info = document.getElementById("mastsinfobox");
            if (thisarticle === null) {
                info.textContent = "Sorry we could not find the post. It might not have been posted yet"
                return
            }
            var a = document.createElement("a");
            a.href = `https://toot.cat/@DPSsys/${thisarticle}`;
            a.target = "_blank"
            a.text = "Reply to this post to add a comment"
            document.getElementById("mastcomenurl").appendChild(a)
            info.textContent = "Loading comments"
            fetch(`https://toot.cat/api/v1/statuses/${thisarticle}/context`)
                .catch((e) => document.getElementById("mastodon_thread").textContent = e)
                .then((d) => d.json())
                .then((j) => {
                    if (!j.descentants) {
                        info.textContent = "No comments"
                    }
                    var elem = document.getElementById("mastcomments");
                    var i = 0;
                    for (var a of j.descendants) {
                        var comm = document.createElement("div")
                        elem.appendChild(comm)
                        comm.classList.add("mastcomment")
                        var useri = document.createElement("div")
                        comm.appendChild(useri)
                        useri.classList.add("userinfo")
                        var pfp = document.createElement("img")
                        useri.appendChild(pfp)
                        pfp.src = a.account.avatar
                        pfp.width = 100
                        pfp.height = 100
                        var name = document.createElement("div")
                        useri.appendChild(name)
                        var uurl = document.createElement("a")
                        name.appendChild(uurl)
                        uurl.target = "_blank"
                        uurl.href = a.url;
                        uurl.textContent = `${a.account.display_name} (${a.account.username})`;
                        var texte = document.createElement("div")
                        comm.appendChild(texte)
                        texte.classList.add("mastcommenttext")
                        texte.innerHTML = a.content
                        i++;
                    }
                    info.textContent = `${i} comments`
                })
                .catch((e) => info.textContent = e)
        })

{% endraw %}
```
It uses a Liquid template from Jekyll too as you see to get the proper id for the article to match it.

What comes next was a giant pain as I am really not good at HTML and CSS but I managed to get a somewhat good format for the comments using the following CSS
```css
#mastcomments {
    display: grid;
    gap: 10px;
}

.mastcomment {
    background-color: #222222;
    border-radius: 5px;
    padding: 5px;
    margin-top: 5px;
    padding-bottom: 15px;
    display: grid;
    grid-column: 1;
    grid-template-columns: 100px auto;
    gap: 10px;
}

.mastcommenttext {
    margin-left: 10px;
    background-color: #111111;
    border-radius: 5px;
    padding: 15px;
    padding-top: 5px;
    min-height: 100px;
    margin-right: 5px;
    grid-column: 2;
}

.userinfo {
    width: 120px;
    grid-column: 1;
}
```
It took quite some time to figure out the whole grid layout thing and it was the most painful thing to fix in the entire project.

Feel free to read the rest of the repository for how it is made as it is public: <https://github.com/EllieTheYeen/ellietheyeen.github.io>

Anyway this was a fun project with some parts that were quite a bit of effort to get fixed like HTML and CSS as most of the other things were way easier related to programming rather than design. You can copy the code I used for this and use on your own blog but be warn that the code is a mess. There are probably way better ways to do certain things here that I did like using some libraries rather than raw JavaScript. Feel free to suggest anything fun to do or any fix in the comment section now that it is there.

You should be able to see comments below this or if not you can add one.

