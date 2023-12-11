---
layout: base
permalink: /images/
---
A file to make it easier to paste in images in VSCode and write alt text

[![
import re
#
def multiple_replace(replacements, text):
    # Create a regular expression from the dictionary keys
    regex = re.compile("(%s)" % "|".join(re.escape(a) for a in replacements), re.I)
    # For each match, look-up corresponding value in dictionary
    return regex.sub(lambda mo: replacements[mo.group().lower()], text)
#
if __name__ == "__main__":
    s = "larry wall is the creator of perl"
    d = {
        "larry wall": "Guido van Rossum",
        "creator": "Benevolent Dictator for Life",
        "perl": "Python",
    }
    print(multiple_replace(d, s))
](/images/23-12-11_05-10-05.png)](/images/23-12-11_05-10-05.png)

[![{%- raw -%}
Syntax highlighted code
---
permalink: /sitemap.xml
---
&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;
&lt;urlset
      xmlns=&quot;http://www.sitemaps.org/schemas/sitemap/0.9&quot;
      xmlns:xsi=&quot;http://www.w3.org/2001/XMLSchema-instance&quot;
      xsi:schemaLocation=&quot;http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd&quot;&gt;
&lt;url&gt;
 &lt;loc&gt;{{ site.url | append: site.baseurl }}/&lt;/loc&gt;
 &lt;lastmod&gt;{{ site.time | date: '%Y-%m-%dT%H:%M:%S+01:00' }}&lt;/lastmod&gt;
 &lt;priority&gt;1.00&lt;/priority&gt;
&lt;/url&gt;
{%- for p in site.posts %}
&lt;url&gt;
 &lt;loc&gt;{{ site.url | append: site.baseurl | append: p.url | urlencode }}&lt;/loc&gt;
 &lt;lastmod&gt;{{ p.date | date: '%Y-%m-%dT%H:%M:%S+01:00' }}&lt;/lastmod&gt;
 &lt;priority&gt;0.66&lt;/priority&gt;
&lt;/url&gt;
{%- endfor -%}
{%- for p in site.pages %}
&lt;url&gt;
 &lt;loc&gt;{{ site.url | append: site.baseurl | append: p.url | urlencode }}&lt;/loc&gt;
 &lt;lastmod&gt;{{ site.time | date: '%Y-%m-%dT%H:%M:%S+01:00' }}&lt;/lastmod&gt;
 &lt;priority&gt;0.10&lt;/priority&gt;
&lt;/url&gt;
{%- endfor %}
&lt;/urlset&gt;{% endraw -%}
](/images/bat.png)](/images/bat.png)

[![
A very colorful text of a directory listing where the x, r and w letters has its own colors
exa -l
.rw-r--r--  766 pi 31 Oct 04:17 favicon.ico
.rw-r--r--  102 pi 12 Nov 23:06 README.md
drwxr-xr-x    - pi 28 Nov 15:45 assets
.rw-r--r--  766 pi 28 Nov 15:45 faviconi.ico
.rw-r--r--  133 pi 28 Nov 15:45 index.html
.rw-r--r-- 7.7k pi 28 Nov 17:40 Gemfile.lock
drwxr-xr-x    - pi 28 Nov 17:41 _site
.rw-r--r-- 1.9k pi  7 Dec 07:17 _config.yml
.rw-r--r--  346 pi  7 Dec 07:17 Gemfile
drwxr-xr-x    - pi  7 Dec 07:17 _includes
drwxr-xr-x    - pi  7 Dec 07:17 _layouts
drwxr-xr-x    - pi  7 Dec 07:17 _posts
drwxr-xr-x    - pi  7 Dec 07:17 pages
drwxr-xr-x    - pi  7 Dec 07:17 redirects
drwxr-xr-x    - pi  7 Dec 07:17 images
drwxr-xr-x    - pi  7 Dec 07:17 robotstuff
](/images/exa.png)](/images/exa.png)

[![
A colorful directory listing where each category of file has a very colorful category
./_includes:
comments.html  share.html  relatedposts.html  header.html
./_layouts:
default.html  post.html  home.html  base.html
./_posts:
2023-10-29-Making-a-simple-RSS-to-Mastodon-poster-powered-by-GitHub-hooks.md  2023-11-05-the-mysteries-of-the-webroot.md            2023-12-06-reposter.md
2023-11-04-open-graph-tags-seo-social.md                                      2023-11-01-Making-Python-EXE-files-on-Windows.md
2023-10-27-blog.md                                                            2023-11-30-what-is-a-file-manager.md
2023-10-31-Previewing-of-3D-models-on-GitHub.md                               2023-11-29-liquid-rss.md
2023-11-10-github-profile-and-special-repositories.md                         2023-11-17-open-graph-oembed-order.md
2023-11-12-useful-command-line-aliases.md                                     2023-11-16-github-all-events-webhook.md
2023-11-03-comments-blog-disqus.md                                            2023-11-08-sitemap-using-liquid.md
2023-11-19-discord-systemd-error-handler.md                                   2023-12-02-sleep-tracker-smart-home-lamps.md
2023-10-30-how-to-create-a-blog-with-jekyll.md                                2023-11-27-dynamic-favicons.md
2023-11-23-share-dialogs-buttons.md                                           2023-11-26-browser-extensions-and-userscripts.md
2023-11-14-github-pages-mastodon-comments.md                                  2023-11-09-your-own-search-engine.md
2023-11-11-compact-exception-printer.md                                       2023-12-03-mastodon-rss-latest-posts-website-feed.md
2023-11-28-generating-share-buttons.md                                        2023-12-04-generate-tables-liquid.md
2023-11-21-automatic-git-templates.md                                         2023-11-24-git-absolute-beginners.md
2023-11-06-github-actions-post-on-mastodon.md                                 2023-11-02-Python-sched-module-rescheduling.md
2023-12-01-tags-without-jekyll-archives.md                                    2023-12-05-throwing-away-jekyll-seo-tag.md
./pages:
about.md  bots.md  projects.md  tags.html
./redirects:
conditions.html  new.html  renaming.html  index.html  sitemaps.html  test.html  story.html  tag.html
./images:
twitterpostedlink.png   discordsystemd.png   twitterpreview.png  thunderbirdrss.png     nautilus.png         xnviewmp.png
discordhookexample.png  slackpreview.png     discordpreview.png  pcmanfm-qt.png         caja.png             xnview.png
bskypreview.png         mastodonpreview.png  allimages.md        midnightcommander.png  windowsexplorer.png  ytree.png
./robotstuff:
bing.xml  yandex.html  robots.txt  listposts.json  indexnow.txt  google.html  sitemap.xml
](/images/ls_colors.png)](/images/ls_colors.png)

[![
Several command line themes being switched between
[oh-my-zsh] Random theme 'trapd00r' loaded
git❨ main ❩
pi@clear:pts/0-> /home > pi > ellietheyeen.github.io (0)
\> ZSH_THEME='random' exec zsh
[oh-my-zsh] Random theme 'juanghurtado' loaded
pi@clear:~/ellietheyeen.github.io
\> ZSH_THEME='random' exec zsh                                                                                                                                 main [c6ac98c]
[oh-my-zsh] Random theme 'superjarin' loaded
[] ~/ellietheyeen.github.io <main> ZSH_THEME='random' exec zsh
[oh-my-zsh] Random theme 'xiong-chiamiov' loaded
┌─[pi@clear] - [~/ellietheyeen.github.io] - [Thu Dec 07, 07:33]
└─[$]> ZSH_THEME='random' exec zsh
[oh-my-zsh] Random theme 'candy-kingdom' loaded
pi@clear:~/ellietheyeen.github.io (branch: main)
\$ ZSH_THEME='random' exec zsh
[oh-my-zsh] Random theme 'xiong-chiamiov-plus' loaded
┌─[pi@clear] - [~/ellietheyeen.github.io] - [Thu Dec 07, 07:33]
└─[$] <git:(main)> ZSH_THEME='random' exec zsh
[oh-my-zsh] Random theme 'frontcube' loaded
~/ellietheyeen.github.io
➞  ZSH_THEME='random' exec zsh                                                                                                                                 [git:main] ✔
[oh-my-zsh] Random theme 'linuxonly' loaded
git:(main)
pi@clear:pts/0->/home/pi/ellietheyeen.github.io (0) git:(main)
\> ZSH_THEME='random' exec zsh
/home/pi/.oh-my-zsh/themes/humza.zsh-theme:13: command not found: bc
[oh-my-zsh] Random theme 'humza' loaded
pi {~/ellietheyeen.github.io}±(main); greetings, earthling [kb]$ ☞ ZSH_THEME='random' exec zsh
[oh-my-zsh] Random theme 'dallas' loaded
{23-12-07 7:34}clear:~/ellietheyeen.github.io@main pi% ZSH_THEME='random' exec zsh
](/images/oh-my-zsh.png)](images/oh-my-zsh.png)

[![
26 / Koofr, Digi Storage and other Koofr-compatible storage providers
   \ (koofr)
27 / Local Disk
   \ (local)
28 / Mail.ru Cloud
   \ (mailru)
29 / Microsoft Azure Blob Storage
   \ (azureblob)
30 / Microsoft OneDrive
   \ (onedrive)
31 / OpenDrive
   \ (opendrive)
32 / OpenStack Swift (Rackspace Cloud Files, Memset Memstore, OVH)
   \ (swift)
33 / Pcloud
   \ (pcloud)
34 / Put.io
   \ (putio)
35 / SMB / CIFS
   \ (smb)
36 / SSH/SFTP
   \ (sftp)
37 / Sia Decentralized Cloud
   \ (sia)
38 / Sugarsync
   \ (sugarsync)
39 / Transparently chunk/split large files
   \ (chunker)
40 / Union merges the contents of several upstream fs
   \ (union)
41 / Uptobox
   \ (uptobox)
42 / WebDAV
   \ (webdav)
43 / Yandex Disk
   \ (yandex)
44 / Zoho
   \ (zoho)
45 / premiumize.me
   \ (premiumizeme)
](/images/rclone.png)](images/rclone.png)

[![
XnView Mp with white background with a small top bar with some operation icons, a side bar with a tree of files, bottom left pans has info about the file like location, dates, histogram button, exiftool button, middle bottom pane has a bunch of categories where you can place an image in, bottom right pane is a preview one. Main pane has large icons that are previews of pictures and the folders have previews of the pictures inside of them and text files like python files have the Python logo on them
](/images/xnviewmp.png)](/images/xnviewmp.png)

[![
Windows Explorer in dark mode showing a folder with many files and there is a bar to the left that shows various folders through quick access and dropbox and a computer icon each with many folders in them. The main window shows around 16 files with big icons with preview for the images. To the right is a preview of a poorly drawn snake that says mew among other things. There is a top bar too that lets you copy stuff and create folders and such.
](/images/windowsexplorer.png)](/images/windowsexplorer.png)

[![
Xnview which is in light mode which has a top bar with many icons that are big for such things such as rotating images. It has a big browsing bar to the left that shows the current directory and nearby ones. The main window is split in two where the top is images that are clickable and the lower is a preview of the image which shows a shark anthro hand holding a big pill that says b
](/images/xnview.png)](/images/xnview.png)

[![
Midnight commander which is command line and is showing two different sides which is browser the folder with white text for most things such as folders and blue for some like favicon.ico and grey for some other files. The top says left, file, command, options and right. The bottom bar says things like help, menu, view, edit, copy, renmov, mkdir, pulldwn and quit and has a line you can enter commands in and a text that says: Hint: Tab changes your current panel.
](/images/midnightcommander.png)](/images/midnightcommander.png)

[![
Ytree which is A very simple file manager with blue background on command line showing just a few things like a file browser and a small window showing what files are in the selectred directory. A pane to the right shows some disk statistics like current size of disk and directory.
](/images/ytree.png)](/images/ytree.png)

[![
Caja which is a simple file manager with white background showing a pane to the left that says computer and network and under that shows a few directories like music, downloads, desktop, pictures, trash and File system. The top pane shows a basic navigation with back and forward buttons and there is also a section where you can go down and up directories and see where you are and a button for each subdirectory and above directory. The main window had a small bar that says: 21 items, free space: 7.2 GB. The main window has icons where there is a note for music and a camera for pictures and such and the files also have icons like a picture of a paper for each and there are abunch of txt and sh files with that icon
](/images/caja.png)](/images/caja.png)

[![
pcmanfm-qt which is mostly identical to Caja but more simplistic and has white background like there are just a few icons on left pane like desktop, trash, computer and applications, the top bare is minimalistic too with a few things like back and forward button and one button for each directory you are in. The main pane has icons like a previewed picture and the txt and similar files are seen as a pic of a paper icon and the shell files are seen as a black paper with a hashbang icon on it
](/images/pcmanfm-qt.png)](/images/pcmanfm-qt.png)


[![
Nautilus which is an even more simplistic file manager with white background and the top bar that just has back and forward buttons and a bar that says home and a few more buttons, the left pane says stuff like documents, trash, downloads, videos, starred, recent and other locations with matching icons. The main pane has very large icons that looks like folders and papers and the pictures folder looks like a camera, music like a note and downloads like a downwards arrow
](/images/nautilus.png)](/images/nautilus.png)

![
A Thunderbird window showing one article that says "this is a test article where this is the first paragraph. a newline then A second paragraph.".
The article is named test and has the subject Test and is by ellietheyeen at midnight and has a website URL that is /test/2023/11/28/test.html
](/images/thunderbirdrss.png)

[![
An oEmbed icon 
oEmbed title 
oEmbed provider_name
](/images/mastodonpreview.png)](/images/mastodonpreview.png)

[![
A favicon icon og:site_name 
og:title 
og:description 
It is possible to put many lines here 
in og:description by placing actual lines in the HTML document 
In fact Mastodon does the same with alt text and it works very good 
It does make the HTML look messy but it is really good for Discord 
Anyway this is some filler text that is useful to see how long descriptions are previewed
](/images/slackpreview.png)](/images/slackpreview.png)

[![
A Twitter icon https://randomness.nu/ogtest/ogtest.html 
randomness.nu 
twitter:title 
twitter:description Line 2 in twitter:description here which is converted to a 
by Bsky but is
](/images/twitterpreview.png)](/images/twitterpreview.png)

[![
A Twitter icon https://randomness.nu/ogtest/ogtest.html 
twitter:title 
https://randomness.nu/ogtest/ogtest.html 
twitter:description 
Line 2 in twitter:description here which is converted to a 
by Bsky but is converted to a space by Twitter
](/images/bskypreview.png)](/images/bskypreview.png)

[![
A favicon icon og:site_name 
og:title 
og:description 
It is possible to put many lines here 
in og:description by placing actual lines in the HTML document 
In fact Mastodon does the same with alt text and it works very good 
It does make the HTML look messy but it is really good for Discord 
Anyway this is some filler text that is useful to see how long descriptions are previewed
](/images/slackpreview.png)](/images/slackpreview.png)


[![
An Open Graph icon oEmbed provider_name 
oEmbed author_name 
og:title 
og:description 
It is possible to put many lines here in og:description by placing actual lines in the HTML document 
In fact Mastodon does the same with alt text and it works very good 
It does make the HTML look messy but it is really good for Discord 
Anyway this is some filler text that is useful to see how long descriptions are previewed
](/images/discordpreview.png)](/images/discordpreview.png)

[![
An oEmbed icon 
oEmbed title 
oEmbed provider_name
](/images/mastodonpreview.png)](/images/mastodonpreview.png)

[![2 Discord messages that says they are from GitHub using the GitHub logo and each of them says that there is a new commit and first one is test branch main from EllieTheYeen Test commit for update and second one is from github-actions commiting the same on the posts branch](/images/discordhookexample.png "Two commits shown on Discord from a bot")](/images/discordhookexample.png)

[![A Twitter post by username EllieTheYeen with this display name HyenRådjuret Elisabeth ΘΔ. 17h. Text on post: New blog post: Adding comments and upvotes to your blog using Disqus. The preview has a picture of a hyena deer that is blue and red sided and anthropomorphic. The preview text says: ellietheyeen.github.io Adding comments and upvotes to your blog using Disqus. So you have a website and you are using a static website generator like jekyll or you do not want to make your own](/images/twitterpostedlink.png)](/images/twitterpostedlink.png)

[![2 Discord messages that says they are from GitHub using the GitHub logo and each of them says that there is a new commit and first one is test branch main from EllieTheYeen Test commit for update and second one is from github-actions commiting the same on the posts branch](/images/discordhookexample.png "Two commits shown on Discord from a bot")](/images/discordhookexample.png)

[![
A Discord message from a bot named systemd at 10:01 with the systemd logo that is green square and triangle inside black square brackets. There is a red embed with the title: Service justfail.service failed and description: × justfail.service - This will just fail 
      Loaded: loaded (/home/pi/.config/systemd/user/justfail.service; static) 
      Active: failed (Result: exit-code) since Sun 2023-11-19 10:01:44 CET; 567ms ago 
     Process: 27410 ExecStart=sh -c echo fail; exit 1 (code=exited, status=1/FAILURE) 
    Main PID: 27410 (code=exited, status=1/FAILURE) 
         CPU: 11ms
](/images/discordsystemd.png)](/images/discordsystemd.png)
