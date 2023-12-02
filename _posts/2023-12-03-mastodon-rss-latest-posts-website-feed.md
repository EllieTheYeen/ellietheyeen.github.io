---
layout: post
title: Mastodon RSS latest posts website feed
date: 2023-12-03 00:07
tags:
- javascript
- mastodon
- html
- rss
---
Do you remember when almost every website had an embedded Twitter feed so you could see the Tweets of the owner of the website? What if I told you that you could achieve the same using the RSS feed from a Mastodon server as it has `Access-Control-Allow-Origin: *` set. What this means is that clients in the browser are able to make requests towards a website without being blocked by the cross origin policy.

* 
{:toc}

## APIs and fetching

While it would also be possible to fetch the statuses from the API, some servers have that a bit locked down so it might be less advisable to use that. The API URL to get statuses from a user on Mastodon looks like the following where `toot.cat` is the instance and `260327` is my own user id that should replaced for someone else  
<https://toot.cat/api/v1/accounts/260327/statuses>  
and you might remember the past article on this blog where we used the API to fetch the replies to a post to make a [Mastodon comment section](https://ellietheyeen.github.io/2023/11/14/github-pages-mastodon-comments.html) where we used the following URL.  
<https://toot.cat/api/v1/statuses/111170465634822734/context>.

We are going to look at the RSS URL which you can get by appending `.rss` after any Mastodon profile URL.  
<https://toot.cat/@DPSsys.rss>  
If you click on it you will see an RSS feed and you can subscribe to it in clients like Thunderbird and such. It is also great if you want a bot to fetch content of what an user like yourself posts like we are going to do here.

## Example
Below you will see 2 buttons. The left one loads only some posts as an example of what it can look like when loading a few posts this way and the right one will fetch live my latest posts from Mastodon.

<button class="btn" onclick="event.target.remove(); loadexample1(); delete loadexample1">Load stored example</button>
<button class="btn" onclick="event.target.remove(); loadexample2(); delete loadexample2">Load live example</button>
<div style="display: grid;">
<div id="someposts1" style="width: 500px; grid-column: 1;"></div>
<div id="someposts2" style="width: 500px; grid-column: 2;"></div>
</div>
<script>
var xmldata = '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:webfeeds="http://webfeeds.org/rss/1.0" xmlns:media="http://search.yahoo.com/mrss/"> <channel> <title>Hyenrådjuret Elisabeth ΘΔ</title> <description>Public posts from @DPSsys@toot.cat</description> <link>https://toot.cat/@DPSsys</link> <image> <url>https://pool.jortage.com/tootcat/accounts/avatars/000/260/327/original/c40aa025edabb4b2.jpg</url> <title>Hyenrådjuret Elisabeth ΘΔ</title> <link>https://toot.cat/@DPSsys</link> </image> <lastBuildDate>Tue, 28 Nov 2023 23:46:29 +0000</lastBuildDate> <webfeeds:icon>https://pool.jortage.com/tootcat/accounts/avatars/000/260/327/original/c40aa025edabb4b2.jpg</webfeeds:icon> <generator>Mastodon v4.3.0-alpha.0+glitch</generator> <item> <guid isPermaLink="true">https://toot.cat/@DPSsys/111490148685626192</guid> <link>https://toot.cat/@DPSsys/111490148685626192</link> <pubDate>Tue, 28 Nov 2023 20:51:01 +0000</pubDate> <description>&lt;p&gt;Have you ever thought of someone saying &amp;quot;The man&amp;quot; seems normal but &amp;quot;The woman&amp;quot; can seem degrading?&lt;/p&gt;</description> </item> <item> <guid isPermaLink="true">https://toot.cat/@DPSsys/111490106099021865</guid> <link>https://toot.cat/@DPSsys/111490106099021865</link> <pubDate>Tue, 28 Nov 2023 20:40:11 +0000</pubDate> <description>&lt;p&gt;I tried full body tracking in VRChat for the first time yesterday and did some settings wrong and people said that I did an interesting &amp;quot;interpretive dance&amp;quot;&lt;/p&gt;</description> <media:content url="https://pool.jortage.com/tootcat/media_attachments/files/111/490/097/079/341/923/original/572594cb74804296.png" type="image/png" fileSize="2275559" medium="image"> <media:rating scheme="urn:simple">nonadult</media:rating> <media:description type="plain">An anthro gargoyle in VRchat where the chest is twisted backwards</media:description> </media:content> <media:content url="https://pool.jortage.com/tootcat/media_attachments/files/111/490/097/488/609/668/original/8586414aa013cdc3.png" type="image/png" fileSize="2344221" medium="image"> <media:rating scheme="urn:simple">nonadult</media:rating> <media:description type="plain">An anthro gargoyle in VRchat where the butt is up in the air and chest backwards and head very down</media:description> </media:content> <media:content url="https://pool.jortage.com/tootcat/media_attachments/files/111/490/097/582/917/852/original/82313a6500f54ecb.png" type="image/png" fileSize="2646059" medium="image"> <media:rating scheme="urn:simple">nonadult</media:rating> <media:description type="plain">An anthro gargoyle in VRchat where the hand goes through the head and the tail up and the body is twisted and hidden somehow</media:description> </media:content> </item> <item> <guid isPermaLink="true">https://toot.cat/@DPSsys/111489666865472740</guid> <link>https://toot.cat/@DPSsys/111489666865472740</link> <pubDate>Tue, 28 Nov 2023 18:48:29 +0000</pubDate> <description>&lt;p&gt;&lt;a href="https://vore.website/" target="_blank" rel="nofollow noopener noreferrer" translate="no"&gt;&lt;span class="invisible"&gt;https://&lt;/span&gt;&lt;span class=""&gt;vore.website/&lt;/span&gt;&lt;span class="invisible"&gt;&lt;/span&gt;&lt;/a&gt;&lt;br /&gt;This is an RSS reader&lt;/p&gt;</description> </item> <item> <guid isPermaLink="true">https://toot.cat/@DPSsys/111489622679595666</guid> <link>https://toot.cat/@DPSsys/111489622679595666</link> <pubDate>Tue, 28 Nov 2023 18:37:15 +0000</pubDate> <description>&lt;p&gt;&lt;a href="https://www.npmjs.com/package/clit" target="_blank" rel="nofollow noopener noreferrer" translate="no"&gt;&lt;span class="invisible"&gt;https://www.&lt;/span&gt;&lt;span class=""&gt;npmjs.com/package/clit&lt;/span&gt;&lt;span class="invisible"&gt;&lt;/span&gt;&lt;/a&gt;&lt;br /&gt;The name of this&lt;/p&gt;</description> </item> <item> <guid isPermaLink="true">https://toot.cat/@DPSsys/111483821696158177</guid> <link>https://toot.cat/@DPSsys/111483821696158177</link> <pubDate>Mon, 27 Nov 2023 18:01:59 +0000</pubDate> <description>&lt;p&gt;Actually everyone does *woof*&lt;/p&gt;</description> <media:content url="https://pool.jortage.com/tootcat/media_attachments/files/111/483/818/576/679/159/original/23a177e6c04965af.jpg" type="image/jpeg" fileSize="58462" medium="image"> <media:rating scheme="urn:simple">nonadult</media:rating> <media:description type="plain">A dog sitting in front of a computer captioned: On the internet nobody knows you are a dog</media:description> </media:content> </item> </channel></rss>';
function safeget(obj, attr) {
    if (obj !== undefined && obj != null && obj[attr]) {
      return obj[attr]
    }
    return null
}
function parseandpresent(base, xml) {
  var title = safeget(xml.querySelector('title'), "textContent")
  var description = safeget(xml.querySelector('description'), "textContent")
  var header = document.createElement("h2")
  header.textContent = description
  base.appendChild(header)
  for (var item of xml.querySelectorAll('item')) {
      var guid = safeget(item.querySelector('guid'), "textContent"), // unique id which is same as link
          link = safeget(item.querySelector('link'), "textContent"), // URL linking to mastodon post
          pubd = safeget(item.querySelector('pubDate'), "textContent") ,// date when posted
          post = safeget(item.querySelector('description'), "textContent"),  // contents of the post
          medias = item.getElementsByTagName('media:content');
      //
      console.log(`Post: guid=${guid} pubd=${pubd} link=${link} post=${post}`)
      var div = document.createElement("div");
      div.style.padding = '5px';
      for (var i = 0; i < medias.length; i++) { // It can have several pictures
          var elem = medias[i],
              mediaurl = safeget(elem.attributes.url, "textContent"),
              fileSize = safeget(elem.attributes.fileSize, "textContent"),
              type = safeget(elem.attributes.type, "textContent"),
              medium = safeget(elem.attributes.medium, "textContent"),
              rating = safeget(safeget(elem.getElementsByTagName('media:rating'), 0), "textContent"), // If marked as nonadult or adult
              alt = safeget(safeget(elem.getElementsByTagName('media:description'), 0), "textContent"); // Alt text
        //
          var img = document.createElement("img");
          img.src = mediaurl
          img.alt = alt
          img.title = alt
          div.appendChild(img)
          var p = document.createElement("p")
          p.textContent = `[Image description: ${alt}]`
          div.append(p)
          console.log(` Has image: mediaurl=${mediaurl} fileSize=${fileSize} type=${type} medium=${medium} rating=${rating} alt=${alt}`)
      }
      div.style.backgroundColor='#000000';
      div.style.border='1px solid #ffffff';
      var texte = document.createElement("div")
      var span = document.createElement("span")
      var a = document.createElement("a")
      a.textContent = title
      a.href = link
      span.innerHTML = post
      texte.appendChild(a)
      texte.appendChild(span)
      div.appendChild(texte)
      base.appendChild(div)
  }
}
var loadexample1 = function() {
  var div = document.getElementById("someposts1")
  var tree = new DOMParser().parseFromString(xmldata, 'text/xml')
  parseandpresent(div, tree)
}
var loadexample2 = async function() {
  var div = document.getElementById("someposts2")
  var rq = await fetch('https://toot.cat/@DPSsys.rss')
  var txt = await rq.text()
  var tree = new DOMParser().parseFromString(txt, 'text/xml')
  parseandpresent(div, tree)
}
</script>

Quite convenient right? You could use this to either load some posts on each build or allow a user to fetch the live ones if you want. I am tho not sure what some Mastodon instance owners would say about traffic generated by such a thing that loads live. It is very cool however.

## Code
The actual code for this that is also embedded in this page you can see below and it fetches (if you chose to) the XML of the RSS feed and parses it and renders everything including image descriptions and such to HTML.

The `xmldata` variable stores the stored string and might look very long even tho it is only a few posts but XML is not the most compact language. If we did the same with JSON from Mastodon it would not be very compact either as Mastodon sends quite some extra data that is sort of redundant from its API's.

The design might also not be the best but you can always change it yourself if you use this code.

`example.html`
```html
<button onclick="event.target.remove(); loadexample1(); delete loadexample1">Load stored example</button>
<button onclick="event.target.remove(); loadexample2(); delete loadexample2">Load live example</button>
<div style="display: grid;">
<div id="someposts1" style="width: 500px; grid-column: 1;"></div>
<div id="someposts2" style="width: 500px; grid-column: 2;"></div>
</div>
<script>
var xmldata = '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:webfeeds="http://webfeeds.org/rss/1.0" xmlns:media="http://search.yahoo.com/mrss/"> <channel> <title>Hyenrådjuret Elisabeth ΘΔ</title> <description>Public posts from @DPSsys@toot.cat</description> <link>https://toot.cat/@DPSsys</link> <image> <url>https://pool.jortage.com/tootcat/accounts/avatars/000/260/327/original/c40aa025edabb4b2.jpg</url> <title>Hyenrådjuret Elisabeth ΘΔ</title> <link>https://toot.cat/@DPSsys</link> </image> <lastBuildDate>Tue, 28 Nov 2023 23:46:29 +0000</lastBuildDate> <webfeeds:icon>https://pool.jortage.com/tootcat/accounts/avatars/000/260/327/original/c40aa025edabb4b2.jpg</webfeeds:icon> <generator>Mastodon v4.3.0-alpha.0+glitch</generator> <item> <guid isPermaLink="true">https://toot.cat/@DPSsys/111490148685626192</guid> <link>https://toot.cat/@DPSsys/111490148685626192</link> <pubDate>Tue, 28 Nov 2023 20:51:01 +0000</pubDate> <description>&lt;p&gt;Have you ever thought of someone saying &amp;quot;The man&amp;quot; seems normal but &amp;quot;The woman&amp;quot; can seem degrading?&lt;/p&gt;</description> </item> <item> <guid isPermaLink="true">https://toot.cat/@DPSsys/111490106099021865</guid> <link>https://toot.cat/@DPSsys/111490106099021865</link> <pubDate>Tue, 28 Nov 2023 20:40:11 +0000</pubDate> <description>&lt;p&gt;I tried full body tracking in VRChat for the first time yesterday and did some settings wrong and people said that I did an interesting &amp;quot;interpretive dance&amp;quot;&lt;/p&gt;</description> <media:content url="https://pool.jortage.com/tootcat/media_attachments/files/111/490/097/079/341/923/original/572594cb74804296.png" type="image/png" fileSize="2275559" medium="image"> <media:rating scheme="urn:simple">nonadult</media:rating> <media:description type="plain">An anthro gargoyle in VRchat where the chest is twisted backwards</media:description> </media:content> <media:content url="https://pool.jortage.com/tootcat/media_attachments/files/111/490/097/488/609/668/original/8586414aa013cdc3.png" type="image/png" fileSize="2344221" medium="image"> <media:rating scheme="urn:simple">nonadult</media:rating> <media:description type="plain">An anthro gargoyle in VRchat where the butt is up in the air and chest backwards and head very down</media:description> </media:content> <media:content url="https://pool.jortage.com/tootcat/media_attachments/files/111/490/097/582/917/852/original/82313a6500f54ecb.png" type="image/png" fileSize="2646059" medium="image"> <media:rating scheme="urn:simple">nonadult</media:rating> <media:description type="plain">An anthro gargoyle in VRchat where the hand goes through the head and the tail up and the body is twisted and hidden somehow</media:description> </media:content> </item> <item> <guid isPermaLink="true">https://toot.cat/@DPSsys/111489666865472740</guid> <link>https://toot.cat/@DPSsys/111489666865472740</link> <pubDate>Tue, 28 Nov 2023 18:48:29 +0000</pubDate> <description>&lt;p&gt;&lt;a href="https://vore.website/" target="_blank" rel="nofollow noopener noreferrer" translate="no"&gt;&lt;span class="invisible"&gt;https://&lt;/span&gt;&lt;span class=""&gt;vore.website/&lt;/span&gt;&lt;span class="invisible"&gt;&lt;/span&gt;&lt;/a&gt;&lt;br /&gt;This is an RSS reader&lt;/p&gt;</description> </item> <item> <guid isPermaLink="true">https://toot.cat/@DPSsys/111489622679595666</guid> <link>https://toot.cat/@DPSsys/111489622679595666</link> <pubDate>Tue, 28 Nov 2023 18:37:15 +0000</pubDate> <description>&lt;p&gt;&lt;a href="https://www.npmjs.com/package/clit" target="_blank" rel="nofollow noopener noreferrer" translate="no"&gt;&lt;span class="invisible"&gt;https://www.&lt;/span&gt;&lt;span class=""&gt;npmjs.com/package/clit&lt;/span&gt;&lt;span class="invisible"&gt;&lt;/span&gt;&lt;/a&gt;&lt;br /&gt;The name of this&lt;/p&gt;</description> </item> <item> <guid isPermaLink="true">https://toot.cat/@DPSsys/111483821696158177</guid> <link>https://toot.cat/@DPSsys/111483821696158177</link> <pubDate>Mon, 27 Nov 2023 18:01:59 +0000</pubDate> <description>&lt;p&gt;Actually everyone does *woof*&lt;/p&gt;</description> <media:content url="https://pool.jortage.com/tootcat/media_attachments/files/111/483/818/576/679/159/original/23a177e6c04965af.jpg" type="image/jpeg" fileSize="58462" medium="image"> <media:rating scheme="urn:simple">nonadult</media:rating> <media:description type="plain">A dog sitting in front of a computer captioned: On the internet nobody knows you are a dog</media:description> </media:content> </item> </channel></rss>';
function safeget(obj, attr) {
    if (obj !== undefined && obj != null && obj[attr]) {
      return obj[attr]
    }
    return null
}
function parseandpresent(base, xml) {
  var title = safeget(xml.querySelector('title'), "textContent")
  var description = safeget(xml.querySelector('description'), "textContent")
  var header = document.createElement("h2")
  header.textContent = description
  base.appendChild(header)
  for (var item of xml.querySelectorAll('item')) {
      var guid = safeget(item.querySelector('guid'), "textContent"), // unique id which is same as link
          link = safeget(item.querySelector('link'), "textContent"), // URL linking to mastodon post
          pubd = safeget(item.querySelector('pubDate'), "textContent") ,// date when posted
          post = safeget(item.querySelector('description'), "textContent"),  // contents of the post
          medias = item.getElementsByTagName('media:content');
      //
      console.log(`Post: guid=${guid} pubd=${pubd} link=${link} post=${post}`)
      var div = document.createElement("div");
      div.style.padding = '5px';
      for (var i = 0; i < medias.length; i++) { // It can have several pictures
          var elem = medias[i],
              mediaurl = safeget(elem.attributes.url, "textContent"),
              fileSize = safeget(elem.attributes.fileSize, "textContent"),
              type = safeget(elem.attributes.type, "textContent"),
              medium = safeget(elem.attributes.medium, "textContent"),
              rating = safeget(safeget(elem.getElementsByTagName('media:rating'), 0), "textContent"), // If marked as nonadult or adult
              alt = safeget(safeget(elem.getElementsByTagName('media:description'), 0), "textContent"); // Alt text
        //
          var img = document.createElement("img");
          img.src = mediaurl
          img.alt = alt
          img.title = alt
          div.appendChild(img)
          var p = document.createElement("p")
          p.textContent = `[Image description: ${alt}]`
          div.append(p)
          console.log(` Has image: mediaurl=${mediaurl} fileSize=${fileSize} type=${type} medium=${medium} rating=${rating} alt=${alt}`)
      }
      div.style.backgroundColor='#000000';
      div.style.border='1px solid #ffffff';
      var texte = document.createElement("div")
      var span = document.createElement("span")
      var a = document.createElement("a")
      a.textContent = title
      a.href = link
      span.innerHTML = post
      texte.appendChild(a)
      texte.appendChild(span)
      div.appendChild(texte)
      base.appendChild(div)
  }
}
var loadexample1 = function() {
  var div = document.getElementById("someposts1")
  var tree = new DOMParser().parseFromString(xmldata, 'text/xml')
  parseandpresent(div, tree)
}
var loadexample2 = async function() {
  var div = document.getElementById("someposts2")
  var rq = await fetch('https://toot.cat/@DPSsys.rss')
  var txt = await rq.text()
  var tree = new DOMParser().parseFromString(txt, 'text/xml')
  parseandpresent(div, tree)
}
```
