---
layout: post
title: 5 Useful Command Line Utilities
date: 2023-12-07 10:22
image: /images/exa.png
tags:
- shell
---
There are many programs and utilities that makes using the command line much easier and adds many convenient features. Here we are going to list 5 of them which are very useful. Most of these are for Linux but you can run all of them under [Cygwin](https://cygwin.com/) on Windows.

* 
{:toc}

## bat
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

<https://github.com/sharkdp/bat> can be installed with `apt install bat` which installs it as `batcat`

Bat is like the command line utility `cat` but it has many more features. One of them is syntax highlighting which is seen in the screenshot above. It is able to automatically detect which language that is being outputted and syntax highlight it.

You can make an alias like the following to always automatically run bat instead of cat and get the syntax highlighting without any line numbers. If you just want to run the normal cat when you have this alias set you can just write `\cat`
```sh
alias cat='batcat -pp'
```

## LS_COLORS
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

<https://github.com/trapd00r/LS_COLORS>

LS_COLORS is a fancy color scheme for programs like ls and other programs that lists files and directories. It sets the environment variable `LS_COLORS` into many more than those included normally in most Linux distributions.

## exa
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

<https://github.com/ogham/exa> can be installed with `apt install exa`

Exa is a replacement for the ls file listing command with more features such as a color scheme that is more fancy than the normal ls with `--color=auto`

## Oh My Zsh
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

<https://github.com/ohmyzsh/ohmyzsh>

Oh My Zsh is a set of themes and plugins for zsh that provides many useful features such as ones that puts more info in the `PS1` environment variable that controls what is being displayed for every prompt. There are plugins and themes for git, exit codes, time and many more.

Note that you have to set the if clause around the line that sets `ZSH_THEME` if you want to do specifically what is done in the picture
```sh
if [ -z "$ZSH_THEME" ]; then
ZSH_THEME="random"
fi
```

## Rclone
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

<https://rclone.org/>

Rclone is a program that allows you to connect both to a wide variety of storage servers using many different protocols and a large amount of different cloud services like Dropbox, OneCloud and Google Drive. It has many features related to syncing, mirroring and a large amount of types of file sharing. A large amount could be said about it but you should really check it out.
