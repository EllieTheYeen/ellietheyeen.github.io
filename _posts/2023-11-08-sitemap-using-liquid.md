---
layout: post
title: Making a sitemap XML in Liquid
date: 2023-11-08 09:59:05 +0100
tags:
- liquid
- jekyll
- sitemap
- xml
- seo
---
Decided to make a simple sitemap generator using Liquid that is a part of jekyll. it is a template language that lets you do quite a few things like you can generate quite a few different data formats using it and it supports iterations and variables and such.

[Liquid](https://shopify.github.io/liquid/) is a fun template language similar to [Jinja](https://jinja.palletsprojects.com/) that allows you to do many useful things and generate all kinds of website related things and it is not only limited to HTML either.

To make something be processed by Liquid you have to place three dashes then some optional yaml then three dashes again like this.
```yml
---
---
Something
```
or
```yml
---
title: Some variable
---
Something else
```
if you want some variables defined and you can even put multiple levels of variables in the yaml like the following
```yml
---
layout: post
title: Test post
date: 2023-11-08 09:31
category: Programming
author: A yeen
tags: [tag1, tag2, tag3]
summary: This is just a test post
---
Content and any Liquid code here
```
This makes it a very powerful language that is easy to write and read both by computers and programmers.

Below is a template using Liquid that generates a sitemap that can be used by various search engines and such.  
`sitemap.xml` liquid
{% raw %}
```xml
---
---
<?xml version="1.0" encoding="UTF-8"?>
<urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

<url>
  <loc>{{ site.url | append: site.baseurl }}/</loc>
  <lastmod>{{ site.time | date: '%Y-%m-%dT%H:%M:%S+01:00' }}</lastmod>
  <priority>1.00</priority>
</url>

{%- for p in site.posts %}
<url>
  <loc>{{ site.url | append: site.baseurl | append: p.url | urlencode }}</loc>
  <lastmod>{{ p.date | date: '%Y-%m-%dT%H:%M:%S+01:00' }}</lastmod>
  <priority>0.66</priority>
</url>
{% endfor %}

{%- for p in site.pages %}
<url>
  <loc>{{ site.url | append: site.baseurl | append: p.url | urlencode }}</loc>
  <lastmod>{{ site.time | date: '%Y-%m-%dT%H:%M:%S+01:00' }}</lastmod>
  <priority>0.10</priority>
</url>
{% endfor %}

</urlset>
```
{% endraw %}
As you see it supports iteration and filters like append and date which is used for date formatting.

This will then render into something approximately like this. Remember that the dates rendering is based on when the site is rendered which means the search engines will not constantly see the current date for pages. This can be good if there is a few extra things on some pages like links on the side that gets updated with interesting content. Some things are cut off from this as there are a lot of pages and there is one of the 3 categories each here

`sitemap.xml` example
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

<url>
  <loc>https://ellietheyeen.github.io/</loc>
  <lastmod>2023-11-08T06:53:00+01:00</lastmod>
  <priority>1.00</priority>
</url>

<url>
  <loc>https://ellietheyeen.github.io/2023/11/06/github-actions-post-on-mastodon.html</loc>
  <lastmod>2023-11-06T14:15:00+01:00</lastmod>
  <priority>0.66</priority>
</url>

<url>
  <loc>https://ellietheyeen.github.io/about.html</loc>
  <lastmod>2023-11-08T06:53:00+01:00</lastmod>
  <priority>0.10</priority>
</url>

</urlset>
```

The sitemap is then put inside the robots.txt that is also generated and search engines can find it inside.

`robots.txt` liquid
{% raw %}
```yml
---
---
User-agent: *
Allow: /
Sitemap: {{ site.url | append: site.baseurl }}/sitemap.xml
```
{% endraw %}
`robots.txt` rendered
```yml
User-agent: *
Allow: /
Sitemap: https://ellietheyeen.github.io/sitemap.xml
```
and will be reusable for other websites.

It is however very recommended to submit your sitemaps to Bing and Google so they can scan them at times and you will be notified about potential issues just like you can do with RSS feeds.

You can also use it to generate a makeshift [JSON](https://www.json.org/json-en.html) API to list all the posts on your Jekyll site which can be convenient since it is is easier to parse if you want to use it for bots or alike.

`listposts.json` liquid
{% raw %}
```liquid
---
---
{
  {%- for p in site.posts %}
    {{ p.title | jsonify }}: {{ site.url | append: site.baseurl | append: p.url | jsonify }}
    {%- unless forloop.last %},{% endunless -%}
  {% endfor %}
}
```
{% endraw %}

You should check out the page for [Jekyll variables](https://jekyllrb.com/docs/variables/) to understand this code better but here is a simple explanation for what they do.
- `site.url` contains the main site url like `http://ellietheyeen.github.io` and it does not have a tailing slash
- `site.baseurl` is often an empty string unless your blog is at some path that is not root then it is just an empty string but it might be something that has a leading slash but no trailing like `/blog` and it is set in `_config.yml` jekyll config
- `site.posts` is all the posts on the site and is essentially an array of associative array that each has attributes like title and url
- `site.time` is the time at the point of when the site is built
- `forloop.last` is a special variable inside for loops to know if they are at the last iteration

There are also several filters that can be good to know what they do
- `jsonify` casts a value into JSON and it might be something like a string or anything really.
- `append:` appends the value of one variable to the value
- `date:` formats an inputted date according to format

There are many fun guides how to do stuff like that like here is one for example
<https://gist.github.com/MichaelCurrin/f8d908596276bdbb2044f04c352cb7c7>

You should try Liquid out and see what useful things you can do using it like generating very convenient web pages with automatically generated elements. Maybe you want a sidebar with the latest posts shown on every page, Liquid makes this very easy.

Anyway this was a fun little project and can be very useful if you have a jekyll site you want to be able to have programmatically listed with a sitemap.
