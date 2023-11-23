---
title: Open graph tags for SEO and social media optimization
date: 2023-11-04 02:52:00 +0100
image: /images/twitterpostedlink.png
---
Have you ever seen links posted on social media where you get a preview of the content of the website that you link and wonder how that is made. It is done using certain HTML tags that a bot fetches when you link the webpage. This is of course subject to the `robots.txt` in the web root as most bots tend to follow that when fetching content. Below is an example of how that can look like.

[![A Twitter post by username EllieTheYeen with this display name HyenRådjuret Elisabeth ΘΔ. 17h. Text on post: New blog post: Adding comments and upvotes to your blog using Disqus. The preview has a picture of a hyena deer that is blue and red sided and anthropomorphic. The preview text says: ellietheyeen.github.io Adding comments and upvotes to your blog using Disqus. So you have a website and you are using a static website generator like jekyll or you do not want to make your own](/images/twitterpostedlink.png)](/images/twitterpostedlink.png)

Having posts presented like this drives more engagement to your website and lets visitors know a bit about what the content is about before visiting adn we want visitors from social media sites to see posts that look interesting and visit our websites.

Meta tags and also the title tag in the head section are used to get this data and various other tags like link tags can also be used for this.

Here we have the data inside the HTML head section that will be seen by various bots when visiting the website. You can press ctrl + u on a website in a browser to see this.
```html
<meta charset='utf-8'>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="/assets/css/style.css?v=e94535de949ec05a5e7490fe9f47cd07337c3f72">
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<meta property="og:image" content="https://github.com/EllieTheYeen.png">
<meta name="twitter:image" content="https://github.com/EllieTheYeen.png">

<!-- Begin Jekyll SEO tag v2.8.0 -->
<title>Adding comments and upvotes to your blog using Disqus | YeenDeer softness blog</title>
<meta name="generator" content="Jekyll v3.9.3" />
<meta property="og:title" content="Adding comments and upvotes to your blog using Disqus" />
<meta property="og:locale" content="en_US" />
<meta name="description" content="So you have a website and you are using a static website generator like jekyll or you do not want to make your own comment section due to the security issues it can cause. What you can do then is use a service like disqus in order to present a comment section inside an iframe. This is one among other solutions to provide a comment section for your blog. There are of course also other ways like Facebook has a thing where you can add a comment section using it. There are also some fancy unusual solutions like using a certain Mastodon post as a comment section which I read about when I searched for another post about how to make a Mastodon share button and both of these posts are extremely interesting and I recommend reading them." />
<meta property="og:description" content="So you have a website and you are using a static website generator like jekyll or you do not want to make your own comment section due to the security issues it can cause. What you can do then is use a service like disqus in order to present a comment section inside an iframe. This is one among other solutions to provide a comment section for your blog. There are of course also other ways like Facebook has a thing where you can add a comment section using it. There are also some fancy unusual solutions like using a certain Mastodon post as a comment section which I read about when I searched for another post about how to make a Mastodon share button and both of these posts are extremely interesting and I recommend reading them." />
<link rel="canonical" href="https://ellietheyeen.github.io/2023/11/03/comments-blog-disqus.html" />
<meta property="og:url" content="https://ellietheyeen.github.io/2023/11/03/comments-blog-disqus.html" />
<meta property="og:site_name" content="YeenDeer softness blog" />
<meta property="og:type" content="article" />
<meta property="article:published_time" content="2023-11-03T06:15:28+01:00" />
<meta name="twitter:card" content="summary" />
<meta property="twitter:title" content="Adding comments and upvotes to your blog using Disqus" />
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BlogPosting","dateModified":"2023-11-03T06:15:28+01:00","datePublished":"2023-11-03T06:15:28+01:00","description":"So you have a website and you are using a static website generator like jekyll or you do not want to make your own comment section due to the security issues it can cause. What you can do then is use a service like disqus in order to present a comment section inside an iframe. This is one among other solutions to provide a comment section for your blog. There are of course also other ways like Facebook has a thing where you can add a comment section using it. There are also some fancy unusual solutions like using a certain Mastodon post as a comment section which I read about when I searched for another post about how to make a Mastodon share button and both of these posts are extremely interesting and I recommend reading them.","headline":"Adding comments and upvotes to your blog using Disqus","mainEntityOfPage":{"@type":"WebPage","@id":"https://ellietheyeen.github.io/2023/11/03/comments-blog-disqus.html"},"url":"https://ellietheyeen.github.io/2023/11/03/comments-blog-disqus.html"}</script>
<!-- End Jekyll SEO tag -->
```

Let's analyze that screenshot in combination with the HTML starting this the following part.
> Adding comments and upvotes to your blog using Disqus

This can be found in various section of the code.
```html
<title>Adding comments and upvotes to your blog using Disqus | YeenDeer softness blog</title>
<meta property="og:title" content="Adding comments and upvotes to your blog using Disqus" />
<meta property="twitter:title" content="Adding comments and upvotes to your blog using Disqus" />
```
At first we have the standard HTML `<title>` element which is used on websites to show what is displayed in the tab and when you hold your cursor over the tab. This can be accessed from JavaScript using the `document.title` and changed to dynamically but that does not work for clients not using JavaScript such as most bots. Bots tend to use this tag to get a title for the webpage unless there is something specific made for the specific bot visiting the page.

Next we have the `<meta property="og:title"` tag. This is used by a large amount of bots such as Facebook, Discord, Bsky, Twitter (unless the twitter:title meta tag is there). Open Graph is an open standard that is used for many social media sites and you can read about it [here](https://ogp.me/).

Third we have the twitter specific meta tags which Twitter will prioritize when fetching a preview for you. You can read about them [here](https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started) and they have some additional features not available by open graph such as showing the Twitter username of someone on Twitter that wrote the post.

> So you have a website and you are using a static website generator like jekyll or you do not want to make your own

```html
<meta name="description" content="So you have a website and you are using a static website generator like jekyll or you do not want to make your own" />
<meta property="og:description" content="So you have a website and you are using a static website generator like jekyll or you do not want to make your own" />
```
The first line is part of a standard meta tag you can read about here on MDN which is one of the best resources for web related documentation.  
<https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name>

The second line is the open graph tag for description which is used by the open graph protocol.

## The picture
If you look at the screenshot it has a picture in it. This can be set with meta tags but some websites will try to find a suitable picture from the website to use. Here are the tags used to display the picture
```html
<meta property="og:image" content="https://github.com/EllieTheYeen.png">
<meta name="twitter:image" content="https://github.com/EllieTheYeen.png">
```
These were not part of the Jekyll SEO Tag plugin and had to be manually added in order to be there. You can set this either to a general picture for your website or a picture relevant to your article.

## Setting up your tags
There are many tools which can help you fetch and preview meta tags for use when testing your website to ensure it previews correctly:  
<https://dnschecker.org/open-graph-preview-generate-metatags.php>

Either what you can do now is to use some premade tool like [Jekyll SEO Tag](https://github.com/jekyll/jekyll-seo-tag) if you use jekyll or there might be something out there relevant to your CMS if you use one.

If you use Twitter you should look into Twitter cards and add a tag such as
```html
<meta name="twitter:card" content="summary" />
```
to get a proper preview on Twitter like in the screenshot and you can read about twitter cards here  
<https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards>

If you make your own site from scratch you can implement dynamically generated tags relevant to the content. You just make sure that they are generated server side as most bots will not load and run the JavaScript even tho so do that using tools such as [PhantomJS](https://phantomjs.org/).

Edit 2023-11-04: Added info about Twitter cards

Now you should know what you need to know in order to make a website that looks fancy on social media to make more engaging content for your readers and for the bots too since they also get to read the new tags that you just added.
