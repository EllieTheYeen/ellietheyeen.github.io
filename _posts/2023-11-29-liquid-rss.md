---
layout: post
title: RSS feed using Liquid
image: /images/thunderbirdrss.png
date: 2023-11-29 00:06
tags:
- jekyll
- liquid
- atom
- xml
- rss
---
Even if [jekyll-feed](https://github.com/jekyll/jekyll-feed) is something you do have if you have a GitHub pages site there are many cases where you do want to be able to make your own RSS feeds. Such cases can be that you have very different categories that would not make sense to have the same feed for or you are using another templating engine such as [Jinja](https://jinja.palletsprojects.com/en/3.1.x/templates/) which has an almost identical syntax or maybe even PHP and want to know the gist of how you would make a feed there. We are only however focusing on Liquid specifically in this article.

If you are not sure what RSS is it is a machine readable format used for getting news. It might have decreased in usage the last few years but in open source communities it is still really popular as it is an open protocol that any bot can go and read and fetch news for you. Here is an example of how it can look using the Thunderbird mail client that has support for RSS and Atom feeds among other things.
![![
A Thunderbird window showing one article that says "this is a test article where this is the first paragraph. a newline then A second paragraph.".
The article is named test and has the subject Test and is by ellietheyeen at midnight and has a website URL that is /test/2023/11/28/test.html
](/images/thunderbirdrss.png)](/images/thunderbirdrss.png)

Now we are going to look at how a file generated by jekyll-feed actually looks like so we can make something similar.

`feed.xml` from jekyll-feed
```xml
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
    <generator uri="https://jekyllrb.com/" version="3.9.3">Jekyll</generator>
    <link href="https://ellietheyeen.github.io/feed.xml" rel="self" type="application/atom+xml" />
    <link href="https://ellietheyeen.github.io/" rel="alternate" type="text/html" />
    <updated>2023-11-28T02:20:01+01:00</updated>
    <id>https://ellietheyeen.github.io/feed.xml</id>
    <title type="html">YeenDeer softness blog</title>
    <subtitle>Ellie the Yeen is a soft YeenDeer and mweeoops</subtitle>
    <author>
        <name>ellietheyeen</name>
    </author>
    <entry>
        <title type="html">Test</title>
        <link href="https://ellietheyeen.github.io/test/2023/11/28/test.html" rel="alternate" type="text/html" title="Test" />
        <published>2023-11-28T02:20:01+01:00</published>
        <updated>2023-11-28T02:20:01+01:00</updated>
        <id>https://ellietheyeen.github.io/test/2023/11/28/test</id>
        <content type="html" xml:base="https://ellietheyeen.github.io/test/2023/11/28/test.html">&lt;p&gt;This is a test article where this is the first paragraph.&lt;/p&gt;

&lt;p&gt;A second paragraph.&lt;/p&gt;

&lt;p&gt;A&lt;br /&gt;
B&lt;br /&gt;
C&lt;/p&gt;</content>
        <author>
            <name>ellietheyeen</name>
        </author>
        <category term="test" />
        <summary type="html">This is a test article where this is the first paragraph.</summary>
        <media:thumbnail xmlns:media="http://search.yahoo.com/mrss/" url="https://github.com/EllieTheYeen.png" />
        <media:content medium="image" url="https://github.com/EllieTheYeen.png"
            xmlns:media="http://search.yahoo.com/mrss/" />
    </entry>
</feed>
```
There are a few things to note when it comes to both this specific generator and RSS in general. According to the [RSS specification](https://www.rssboard.org/rss-specification) and the [Atom specification](https://www.rfc-editor.org/rfc/rfc4287) plus the tags we can know that this is more specifically an Atom file rather than an RSS file. It is also important to take note of the `id` field called `guid` in RSS where a unique identifier must exist as clients use it in order to know if an article is new or not.

Using this information we can make our own template using Liquid (And pretty much any other templating language really).

`rssfeed.xml` liquid
```xml
{%- raw -%}
<feed xmlns="http://www.w3.org/2005/Atom">
<generator uri="https://ellietheyeen.github.io/" version="1.0.0">A yeen deer</generator>
<link href="{{ page.url | absolute_url }}" rel="self" type="application/atom+xml"/>
<link href="{{ site.baseurl | absolute_url }}" rel="alternate" type="text/html"/>
<updated>{{ site.time | date: '%Y-%m-%dT%H:%M:%S+01:00' }}</updated>
<id>{{ page.url | absolute_url }}</id>
<title type="html">{{ site.title }}</title>
<subtitle>{{ site.description }}</subtitle>
<author>
<name>{{ site.author }}</name>
</author>
{% comment You can put what filter you want here %}{% endcomment %}
{%- assign articles = site.posts | where: "category", "test" -%}
{%- for a in articles -%}
{%- if a == page -%}{%- continue -%}{%- endif -%}
{% comment
                     ^ ^ ^ ^ ^ ^ ^ ^ 
To prevent accidents where Jekyll crashes due to infinite loop due to it trying to access itself

We also want only articles with set dates since otherwise it would be hard to get a RSS feed functioning good
%}{% endcomment %}
{%- unless a.date -%}{%- continue -%}{%- endunless -%}
<entry>
<title type="html">{{ a.title | escape }}</title>
<link href="{{ a.url | absolute_url }}" rel="alternate" type="text/html" title="{{ a.title | escape }}"/>
<published>{{ a.date | date: '%Y-%m-%dT%H:%M:%S+01:00' }}</published>
<updated>{{ a.date | date: '%Y-%m-%dT%H:%M:%S+01:00' }}</updated>
<id>{{ a.id | absolute_url }}</id>
<content type="html" xml:base="{{ a.url | absolute_url }}">
{{ a.content | escape | strip }}
</content>
<author>
<name>{{ a.author | default: site.author }}</name>
</author>
<summary type="html">
{{ a.excerpt | escape | strip }}
</summary>
{% assign image = a.image.path | default: a.image | default: site.defaultmedia -%}
{%- if image -%}
<media:thumbnail xmlns:media="http://search.yahoo.com/mrss/" url="{{ image }}"/>
<media:content xmlns:media="http://search.yahoo.com/mrss/" medium="image" url="{{ image }}"/>
{%- endif %}
</entry>
{%- endfor %}
</feed>
{% endraw %}
```
This Liquid code will generate a XML file that can be read by clients like [Thunderbird](https://www.thunderbird.net/) and [Vore](https://vore.website/). Firefox used to have RSS bookmarks which seems to have been removed now but there is an addon called [Livemarks](https://addons.mozilla.org/en-US/firefox/addon/livemarks/) that adds it back. It only make a feed from one specific category here but you can easily change it to what you want. Jekyll provides the `id` for each page that we can use to make an id unless we ofc use the `path` attribute instead as long as we do not change it later since that could cause issues.

Here is an example of what the template just generated when there is a single test article in the test category.

`rssfeed.xml` rendered
```xml
<feed xmlns="http://www.w3.org/2005/Atom">
<generator uri="https://ellietheyeen.github.io/" version="1.0.0">A yeen deer</generator>
<link href="https://ellietheyeen.github.io/2023/11/28/rsstest.html" rel="self" type="application/atom+xml"/>
<link href="https://ellietheyeen.github.io/" rel="alternate" type="text/html"/>
<updated>2023-11-28T18:35:00+01:00</updated>
<id>https://ellietheyeen.github.io/2023/11/28/rsstest.html</id>
<title type="html">YeenDeer softness blog</title>
<subtitle>Ellie the Yeen is a soft YeenDeer and mweeoops</subtitle>
<author>
<name>ellietheyeen</name>
</author><entry>
<title type="html">Test</title>
<link href="https://ellietheyeen.github.io/test/2023/11/28/test.html" rel="alternate" type="text/html" title="Test"/>
<published>2023-11-28T00:00:00+01:00</published>
<updated>2023-11-28T00:00:00+01:00</updated>
<id>https://ellietheyeen.github.io/test/2023/11/28/test</id>
<content type="html" xml:base="https://ellietheyeen.github.io/test/2023/11/28/test.html">
This is a test article where this is the first paragraph.

A second paragraph.
</content>
<author>
<name>ellietheyeen</name>
</author>
<summary type="html">
&lt;p&gt;This is a test article where this is the first paragraph.&lt;/p&gt;
</summary>
<media:thumbnail xmlns:media="http://search.yahoo.com/mrss/" url="https://github.com/EllieTheYeen.png"/>
<media:content xmlns:media="http://search.yahoo.com/mrss/" medium="image" url="https://github.com/EllieTheYeen.png"/>
</entry>
</feed>
```
Now if we compare it to what the actual Jekyll feed generates we see that it is quite similar enough except some whitespace things and that the generator and a few dates are changed.

`feed.diff`
```diff
1d0
< <?xml version="1.0" encoding="utf-8"?>
3,7c2,6
<     <generator uri="https://jekyllrb.com/" version="3.9.3">Jekyll</generator>
<     <link href="https://ellietheyeen.github.io/feed.xml" rel="self" type="application/atom+xml" />
<     <link href="https://ellietheyeen.github.io/" rel="alternate" type="text/html" />
<     <updated>2023-11-28T02:20:01+01:00</updated>
<     <id>https://ellietheyeen.github.io/feed.xml</id>
---
>     <generator uri="https://ellietheyeen.github.io/" version="1.0.0">A yeen deer</generator>
>     <link href="https://ellietheyeen.github.io/rsstest.xml" rel="self" type="application/atom+xml"/>
>     <link href="https://ellietheyeen.github.io/" rel="alternate" type="text/html"/>
>     <updated>2023-11-28T19:12:36+01:00</updated>
>     <id>https://ellietheyeen.github.io/rsstest.xml</id>
15,17c14,16
<         <link href="https://ellietheyeen.github.io/test/2023/11/28/test.html" rel="alternate" type="text/html" title="Test" />
<         <published>2023-11-28T02:20:01+01:00</published>
<         <updated>2023-11-28T02:20:01+01:00</updated>
---
>         <link href="https://ellietheyeen.github.io/test/2023/11/28/test.html" rel="alternate" type="text/html" title="Test"/>
>         <published>2023-11-28T00:00:00+01:00</published>
>         <updated>2023-11-28T00:00:00+01:00</updated>
19c18,19
<         <content type="html" xml:base="https://ellietheyeen.github.io/test/2023/11/28/test.html">&lt;p&gt;This is a test article where this is the first paragraph.&lt;/p&gt;
---
>         <content type="html" xml:base="https://ellietheyeen.github.io/test/2023/11/28/test.html">
> &lt;p&gt;This is a test article where this is the first paragraph.&lt;/p&gt;
22,25c22
<
< &lt;p&gt;A&lt;br /&gt;
< B&lt;br /&gt;
< C&lt;/p&gt;</content>
---
>         </content>
29,33c26,30
<         <category term="test" />
<         <summary type="html">This is a test article where this is the first paragraph.</summary>
<         <media:thumbnail xmlns:media="http://search.yahoo.com/mrss/" url="https://github.com/EllieTheYeen.png" />
<         <media:content medium="image" url="https://github.com/EllieTheYeen.png"
<             xmlns:media="http://search.yahoo.com/mrss/" />
---
>         <summary type="html">
> &lt;p&gt;This is a test article where this is the first paragraph.&lt;/p&gt;
>         </summary>
>         <media:thumbnail xmlns:media="http://search.yahoo.com/mrss/" url="https://github.com/EllieTheYeen.png"/>
>         <media:content xmlns:media="http://search.yahoo.com/mrss/" medium="image" url="https://github.com/EllieTheYeen.png"/>
```

RSS and Atom feeds are still quite used in some places like Mastodon for example where for each user it automatically generates an RSS feed that you can get their posts from. My own feed is the following: <https://toot.cat/@DPSsys.rss> and you can put it in Thunderbird or similar.

There are also more modernized versions of RSS where it has more become a push protocol rather than a pull protocol using things such as [websub](https://www.w3.org/TR/websub/) which used to be called pubsubhubbub which [YouTube uses](https://developers.google.com/youtube/v3/guides/push_notifications) to notify on new videos.

You can do many fun things with RSS feeds like make bots that read them and post new articles on social media whenever they arrive [such as this blog has](https://ellietheyeen.github.io/2023/10/29/Making-a-simple-RSS-to-Mastodon-poster-powered-by-GitHub-hooks.html).
