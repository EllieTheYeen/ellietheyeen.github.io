---
title: The mysteries of the web root
date: 2023-11-05 03:18:22 +0100
---
There are many files in the web root folder that is used for many different things that are often automatically grabbed by either bots or your browser. Here is a list of various things I have used and read about.

A command like this ran in your `/var/log/apache2` can be used to find all kinds of different things that has been accessed in your server in the logs.
```sh
cat *.gz | gunzip | grep -o -P '(GET|POST) [^ ]+' | sort | uniq
```



## index.html
This is a common file to exist here. There might be all kinds of index. files such as `index.php` and even [index.json](https://github.com/EllieTheYeen/ellietheyeen.github.io/blob/main/.well-known/webfinger/index.json).

The typical behavior for a web server is for every directory you visit on a website it will look for an index file and if that file exists then display or run it otherwise it will run directory listing if that is on. You can disable directory listing by creating an empty `index.html` in fact which is good if you want to hide things or provide your own directory lister.

If both `index.php` and `index.html` exists on a website where php is considered a valid index file then it might prioritize one of them and you can try accessing either http://example.com

## favicon.ico
This is really important and browsers tend to automatically try to fetch this to use to display as an icon on the browser tab but it can be overridden like the following.
```html
<link rel="icon" type="image/x-icon" href="/favicon.ico">
```
You should have some icon to uniquely identify your website here and you can even use the HTML element to change it dynamically after the page has been loaded to show a different icon if the user has notifications.

![Some small red and blue creature](/favicon.ico)
Here is the picture this website has as a favicon and it should be a red and blue creature unless it has been changed when you read this later.

## robots.txt
The [Robots Exclusion Standard](https://en.wikipedia.org/wiki/Robots.txt) for friendly bots. Bots tend to follow these rules and it both is intended to make bots to go to places and not go to places and also provide extra info for them like sitemaps. Below is an example of one that allows absolutely everything  
```robots
User-agent: *
Allow: /
```
User-agent can be set to specific bots and many Disallow and Allow paths may follow for every bot. Remember that malicious bots being contrarian in nature makes them specifically go to places where you tell them not to go so do not put some Disallow rule on your secret admin panel or such.

A HUGE amount of robots will visit your website for all kinds of reasons. Here is a whole bunch of reasons a robot might visit your website
1. Search indexing
2. Someone pasted in a link to your website on social media or a chat client
3. Some malicious bot appears and tries to hit things in hope to find a vulnerability
4. Someone used a downloader or user operated spider on your website like [Wget](https://www.gnu.org/software/wget/) (This can bypass robots.txt at times if specified by the user)
5. An API or webhook on your website received a call
6. A malfunctioning robot accidentally hitting your site
7. RSS clients that are looking for new articles on your website. Maybe you have a tag like `<link rel="alternate" type="application/rss+xml" title="RSS" href="https://ellietheyeen.github.io/feed.xml">`
8. Tools like google webmasters or the bing equivalent trying to find the verification file and to see if it is still there (Yes you can block this)
9. Someone told a bot maybe like ChatGPT to fetch something from your website or it arrived automatically
10. Site accelerators that fetch pages that it predicts you might fetch or converting data for slow clients 
11. You clicked on some link on a website that then read the `referer` header on your request and sent a bot back to analyze it. The creative commons license website has been known to do this.
12. [Pingbacks](https://en.wikipedia.org/wiki/Pingback) for your blog like wordpress `xmlrpc.php` which is used to find who referenced your article in their own
13. Vulnerability scanners that are meant to warn users
14. Bots simply just fetching the title such as ones on wikis
15. Down detectors that verify that your website is online
16. Mastodon verifying that you have a rel="me" for verification looking like this: `<a href="https://toot.cat/@DPSsys" target="_blank" rel="me">Mastodon</a>`

### Example of disallowing
Below is an example of blocking 2 different ChatGPT related robots. The first one is to block the crawling bot and the second is to block the user operated bot and this was found at <https://www.furaffinity.net/robots.txt>
```robots
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /
```

## humans.txt
Mostly a thing to allow people to see the humans behind a website. Not as relevant for me as I am a creature but you can read about it here.  
<https://humanstxt.org/>

## .well-known
This is defined in the following document  
<https://www.rfc-editor.org/rfc/rfc8615>

It is a general purpose folder made for various bots and you can find a list of what bots uses it at  
<https://en.wikipedia.org/wiki/Well-known_URI>  
It is an extremely interesting article and list a lot of other things that use the standard such as  
<https://en.wikipedia.org/wiki/Security.txt>  
<https://en.wikipedia.org/wiki/WebFinger>

There are many things that use this like both [Mastodon](https://docs.joinmastodon.org/spec/webfinger/) and [Certbot](https://certbot.eff.org/) which you use to get free SSL certificates from <https://letsencrypt.org/>

## .htaccess and .htpasswd
These are used by Apache to add things such as passwords to directories where `.htaccess` defines various rules and `.htpasswd` contains an encrypted password but these tend to not be accessible by HTTP but rather just be there  
<https://httpd.apache.org/docs/current/howto/htaccess.html>

## cgi-bin
While technically not at the location itself of the webroot at least most of the time as it tends to be aliased there it is still a very common location you can access on servers by writing `/cgi-bin/` but it tends to have directory listing off. The location of it tends to be something like `/usr/lib/cgi-bin/` in Linux. If you know a script there you can access it tho.

## google*.html
Used for verification in [Google search console](https://search.google.com/search-console/) that used to be called Google WebMasters in order to let you display performance for your website and to add sitemaps.
### BingSiteAuth.xml
Similar for [Bing webmaster tools](https://www.bing.com/webmasters/help/add-and-verify-site-12184f8b)

## xmlrpc.php
This was sort of an early attempt at federating the internet with blogs from wordpress getting referred by other blogs got links added to them but as you can guess this was heavily exploited and newer solutions for this.

## crossdomain.xml
Used by Flash and Unity web player in order to define what is allowed to open sockets to. Ypu can find information about it in the following link but it tends to be very legacy at this point with both of those falling into disuse.  
<https://www.adobe.com/devnet-docs/acrobatetk/tools/AppSec/xdomain.html>

## Probably accidental files
It is easy to accidentally upload some files that you do not want to upload that some bots might try to find in order to exploit your website.

### .env
[Dotenv](https://www.npmjs.com/package/dotenv) file which very likely contains credentials

### .git
[Git](https://git-scm.com/) version control system and might have credentials at `.git/credentials`

### .vscode
Someone accidentally uploaded their VSCode project to the web. Files containing secrets like usernames and passwords like `.vscode/sftp.json` might exist inside from a sftp extension.
