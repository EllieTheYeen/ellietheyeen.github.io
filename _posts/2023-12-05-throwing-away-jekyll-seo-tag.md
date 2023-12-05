---
layout: post
title: Throwing away jekyll-seo-tag
date: 2023-12-05 02:42
tags:
- jekyll
- liquid
- seo
---
So recently there was a problem on Bing webmasters where it complained that the site has too long description meta tags. The reason for this is that Jekyll takes the description from the `site.excerpt` variable which is something that can be very long and sometimes almost a thousand characters in some circumstances. There were 2 alternatives to solve this. One is to rewrite every single post to have a specific description that does not exceed the specifications or we can create our own meta tags and the latter is what we are going to do.

* 
{:toc}

## What jekyll-seo-tag does
Do you can read about [Jekyll variables here](https://jekyllrb.com/docs/variables/) and see that there are quite a few ones that Jekyll sets that we can use in Liquid and also that Liquid has some useful filter especially the [slice filter](https://shopify.github.io/liquid/filters/slice/) which is like `substr` or `substring` in most other languages. What this does is it cuts off text by skipping some characters in the beginning and end of the string similar to the [slice notation in Python](https://docs.python.org/3/reference/expressions.html#grammar-token-python-grammar-slicing).

What [jekyll-seo-tag](https://github.com/jekyll/jekyll-seo-tag) does is create a bunch of meta tags that is used in order to make the website more friendly to search engines and social media preview fetch robots like first the title element that is filled in with the post title and site title then description which is fetched from excerpt which is essentially just the first paragraph of a post unless you set it elsewhere.

Below is an example output of jekyll-seo-tag which is from the this page of this blog where you can see it has set various things like the image too from an image variable set in config, the required twitter card meta tag for twitter preview, and the description is 541 characters long which is way longer than the max of 160 that Bing wants.

#### Part of `index.html` where jekyll-seo-tag is
```html
<!-- Begin Jekyll SEO tag v2.8.0 -->
<title>Throwing away jekyll-seo-tag | YeenDeer softness blog</title>
<meta name="generator" content="Jekyll v3.9.3" />
<meta property="og:title" content="Throwing away jekyll-seo-tag" />
<meta name="author" content="ellietheyeen" />
<meta property="og:locale" content="en_US" />
<meta name="description" content="So recently there was a problem on Bing webmasters where it complained that the site has too long description meta tags. The reason for this is that Jekyll takes the description from the site.excerpt variable which is something that can be very long and sometimes almost a thousand characters in some circumstances. There were 2 alternatives to solve this. One is to rewrite every single post to have a specific description that does not exceed the specifications or we can create our own meta tags and the latter is what we are going to do." />
<meta property="og:description" content="So recently there was a problem on Bing webmasters where it complained that the site has too long description meta tags. The reason for this is that Jekyll takes the description from the site.excerpt variable which is something that can be very long and sometimes almost a thousand characters in some circumstances. There were 2 alternatives to solve this. One is to rewrite every single post to have a specific description that does not exceed the specifications or we can create our own meta tags and the latter is what we are going to do." />
<link rel="canonical" href="https://ellietheyeen.github.io/2023/12/05/throwing-away-jekyll-seo-tag.html" />
<meta property="og:url" content="https://ellietheyeen.github.io/2023/12/05/throwing-away-jekyll-seo-tag.html" />
<meta property="og:site_name" content="YeenDeer softness blog" />
<meta property="og:image" content="https://github.com/EllieTheYeen.png" />
<meta property="og:type" content="article" />
<meta property="article:published_time" content="2023-12-05T00:39:00+01:00" />
<meta name="twitter:card" content="summary" />
<meta property="twitter:image" content="https://github.com/EllieTheYeen.png" />
<meta property="twitter:title" content="Throwing away jekyll-seo-tag" />
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BlogPosting","author":{"@type":"Person","name":"ellietheyeen"},"dateModified":"2023-12-05T00:39:00+01:00","datePublished":"2023-12-05T00:39:00+01:00","description":"So recently there was a problem on Bing webmasters where it complained that the site has too long description meta tags. The reason for this is that Jekyll takes the description from the site.excerpt variable which is something that can be very long and sometimes almost a thousand characters in some circumstances. There were 2 alternatives to solve this. One is to rewrite every single post to have a specific description that does not exceed the specifications or we can create our own meta tags and the latter is what we are going to do.","headline":"Throwing away jekyll-seo-tag","image":"https://github.com/EllieTheYeen.png","mainEntityOfPage":{"@type":"WebPage","@id":"https://ellietheyeen.github.io/2023/12/05/throwing-away-jekyll-seo-tag.html"},"url":"https://ellietheyeen.github.io/2023/12/05/throwing-away-jekyll-seo-tag.html"}</script>
<!-- End Jekyll SEO tag -->
```
## Our solution
But that does not stop us from doing the whole thing ourselves if we want some customization such as fixing the too long description tag and various other things like removing some redundant tags like some of the twitter ones and baking everything together in a more readable format.

#### `header.html` liquid
```html
{%- raw -%}
<title>{{ page.title | append: ' | ' | append: site.title | escape }}</title>
{%- assign desc = page.excerpt | strip_html | slice: 0, 160 | escape %}
<!-- Standardized -->
<meta name="author" content="{{ page.author | default: site.author | escape }}" />
<meta name="robots" content="index, follow" />
<meta name="description" content="{{ desc }}" />
<meta name="msapplication-navbutton-color" content="#ff1526" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<!-- OpenGraph -->
<meta name="og:url" content="{{ page.url | absolute_url }}" />
<meta name="og:type" content="{%- if page.date -%}article{%- else -%}website{%- endif -%}" />
<meta name="og:title" content="{{ page.title | escape }}" />
{% assign image = page.image.path | default: page.image | default: site.defaultmedia -%}
{%- if image -%}
<meta name="og:image" content="{{ image | absolute_url }}" />
{% endif -%}
<meta name="og:locale" content="en_US" />
<meta name="og:site_name" content="{{ site.title }}" />
<meta name="og:description" content="{{ desc }}" />
{%- if page.date %}
<meta name="article:published_time" content="{{ page.date | date: '%Y-%m-%dT%H:%M:%S+01:00' }}" />
{%- endif %}
<!-- Discord -->
<meta name="theme-color" content="#ff1526" />
<!-- Twitter -->
<meta name="twitter:card" content="summary" />
<!-- Link -->
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="canonical" href="{{ page.url | absolute_url }}" />
{% feed_meta %}
{% endraw -%}
```

You might wonder how this looks rendered and here is the whole thing rendered which is basically equivalent to how jekyll-seo-tag does it but more compact as we removed and compacted things and as you see the meta tag is no longer way too long.

#### `header.html` rendered
```html
<title>Throwing away jekyll-seo-tag | YeenDeer softness blog</title>
<!-- Standardized -->
<meta name="author" content="ellietheyeen" />
<meta name="robots" content="index, follow" />
<meta name="description" content="So recently there was a problem on Bing webmasters where it complained that the site has too long description meta tags. The reason for this is that Jekyll take" />
<meta name="msapplication-navbutton-color" content="#ff1526" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<!-- OpenGraph -->
<meta name="og:url" content="https://ellietheyeen.github.io/2023/12/05/throwing-away-jekyll-seo-tag.html" />
<meta name="og:type" content="article" />
<meta name="og:title" content="Throwing away jekyll-seo-tag" />
<meta name="og:image" content="https://github.com/EllieTheYeen.png" />
<meta name="og:locale" content="en_US" />
<meta name="og:site_name" content="YeenDeer softness blog" />
<meta name="og:description" content="So recently there was a problem on Bing webmasters where it complained that the site has too long description meta tags. The reason for this is that Jekyll take" />
<meta name="article:published_time" content="2023-12-05T00:39:00+01:00" />
<!-- Discord -->
<meta name="theme-color" content="#ff1526" />
<!-- Twitter -->
<meta name="twitter:card" content="summary" />
<!-- Link -->
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="canonical" href="https://ellietheyeen.github.io/2023/12/05/throwing-away-jekyll-seo-tag.html" />
<link type="application/atom+xml" rel="alternate" href="https://ellietheyeen.github.io/feed.xml" title="YeenDeer softness blog" />
```

We hope you found this interesting as it was a fun article to write and feel free to ask any questions in the comments
