---
layout: post
title: Generating share buttons using Liquid
date: 2023-11-28 00:00
tags:
- liquid
- html
---
[Liquid](https://github.com/Shopify/liquid) is a powerful templating language even if it is a non evaluating one. In the past we made some [Share buttons](https://ellietheyeen.github.io/2023/11/23/share-dialogs-buttons.html) using all the data we had gathered from various websites about how they use URLs for their share dialogs. What we can do with this data is generate share buttons in a fancy and easy way using Liquid.

* 
{:toc}

## Fields

The way we are going to do this is to first define what type of fields there are that a share dialog can use and then we are going to use those in order to generate the share button using generated data by constructing the url. There are a few so called data types we need to look into where we have the following.

1. `body`: This is something typically used by email and for anything that wants a link and the title inside a text field. Think of how in sites like twitter you can post a link and some text or the contents of an email
2. `title`: This is the title of the post we are going to share which is used on some websites that want a title for shared links like Reddit, Tumblr and Pinterest and is same as the HTML title element's contents and an emails subject
3. `description`: The description of the thing which is basically the same as the meta or og description meta tag and tends to come from the excerpt in jekyll. We do however not need to fetch this usually for most things as a bot in the website will fetch it from our meta tags.
4. `url`: This is an URL to our post that we want to have shared when the user presses the button. Either this field or body must be specified since otherwise no link would be sent anywhere.
5. `base`: This is the basic share part of the url which includes the hostname and the path to the share dialog and in the case of Twitter it is `https://twitter.com/intent/tweet` or `mailto:` for email.
6. `extras`: Additional parameters we need in order to send to the share dialog in order for it to actually function such as tumblr specifying that you have a post of the type link using `posttype=link`
7. `name`: The name of the share button as it is being presented on the website.
8. `color`: The color of the share button.

Remember these names are arbitrary but we need to define them in order for us to generate the correct data in order to generate a share button that works.

## Configuration
Now that we have defined what kind of fields exist we should define them in the configuration for the code to use. This is placed in `_config.yml` which is the Jekyll config but you can probably make your own solution if you are using another templating engine. As you see we define here what kind of share buttons we want to appear at the bottom of the page.

`_config.yml`
```yml
sharebuttons:
  - name: Tumblr
    base: https://www.tumblr.com/widgets/share/tool
    extra: posttype=link
    url: canonicalUrl
    title: title
    color: '#34465D'
  - name: Twitter
    base: https://twitter.com/intent/tweet
    url: url
    title: text
    color: '#08a0e9'
  - name: Reddit
    base: https://reddit.com/submit
    url: url
    title: title
    color: '#ff4500'
  - name: Facebook
    base: https://www.facebook.com/sharer.php
    url: u
    color: '#4267B2'
  - name: Pinterest
    base: http://pinterest.com/pin/create/link/
    url: url
    title: description
    media: media
    color: '#cc2127'
  - name: Telegram
    base: https://telegram.me/share/url
    url: url
    color: '#27a6e7'
  - name: YCombinator
    base: https://news.ycombinator.com/submitlink
    url: u
    title: t
    color: '#cc5200'
  - name: Instapaper
    base: https://www.instapaper.com/edit
    url: url
    color: '#828181'
  - name: Pinboard
    base: https://pinboard.in/add
    url: url
    color: '#1120ab'
  - name: Pocket
    base: https://getpocket.com/edit
    url: url
    color: '#e0264b'
  - name: GMail
    base: https://mail.google.com/mail/u/0/
    extra: 'fs=1&tf=cm'
    body: body
    color: '#ea4235'
  - name: Blogger
    base: https://www.blogger.com/blog_this.pyra
    body: n
    color: '#ff5722'
  - name: Email
    base: 'mailto:'
    body: body
    title: subject
    color: '#26BF74'
```

## The code
Now for the actual code that generates the buttons we have this thing written in Liquid that generates an array using a quite strange method as there is no literal in Liquid in order to define an array. After that we can append whatever fields we want to the array using `push` and eventually join them together using `join`. We only use what fields are defined in the configuration and skip the other ones and the `base`, `name` and `color` parts are not put in the array as they belong in other places.

Part of `_includes/share.html`
```liquid
{%- raw -%}
{% for butt in site.sharebuttons %}
{%- assign elems = "" | split: "" -%}

{%- if butt.extra -%}
{%- assign elems = elems | push: butt.extra -%}
{%- endif -%}

{%- if butt.url -%}
{%- assign url = butt.url | append: '=' -%}
{%- assign url = url | append: 'https://ellietheyeen.github.io' | append: page.url | uri_escape -%}
{%- assign elems = elems | push: url -%}
{%- endif -%}

{%- if butt.media -%}
{%- assign media = butt.media | append: '=' -%}
{%- assign mediaurl = page.image | absolute_url -%}
{%- assign media = media | append: mediaurl -%}
{%- assign elems = elems | push: media -%}
{%- endif -%}

{%- if butt.body -%}
{%- assign body = butt.body | append: '=' -%}
{%- assign body = body | append: '%0A' -%}
{%- assign body = body | append: 'https://ellietheyeen.github.io' | append: page.url | uri_escape -%}
{%- assign body = body | append: '%0A' -%}
{%- assign elems = elems | push: body -%}
{%- endif -%}

{%- if butt.title -%}
{%- assign title = butt.title | append: '=' -%}
{%- assign title = title | append: page.title | uri_escape -%}
{%- assign elems = elems | push: title -%}
{%- endif -%}

<a class="sharelink" title="Share this on {{ butt.name }}" target="_blank"
    href="{{ butt.base }}?{{ elems | join: '&' }}">
    <span class="btn" style="background-color: {{ butt.color }};">{{ butt.name }}</span>
</a>
{% endfor %}
{% endraw %}
```
You should see the buttons below on each post on this blog and feel free to reuse the code for this for what you want
