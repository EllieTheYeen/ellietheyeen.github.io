---
title: Adding comments and upvotes to your blog using Disqus
date: 2023-11-03 06:15:28 +0100
tags:
- comments
- disqus
- html
- javascript
- jekyll
---
So you have a website and you are using a static website generator like jekyll or you do not want to make your own comment section due to the security issues it can cause. What you can do then is use a service like disqus in order to present a comment section inside an iframe. This is one among other solutions to provide a comment section for your blog. There are of course also other ways like Facebook has a thing where you can add a comment section using it. There are also some fancy unusual solutions like using a certain [Mastodon post as a comment section](https://www.kylereddoch.me/2023/02/13/adding-mastodon-comments-jekyll-blog.html) which I read about when I searched for another post about how to make a [Mastodon share button](https://www.kylereddoch.me/2023/02/20/creating-mastodon-share-button.html) and both of these posts are extremely interesting and I recommend reading them.

Generally on blogs the comment section loads automatically but we generally do not want to make a heavy site and there is also the privacy issues of automatically loading external things that might have tracking inside them so we leave it up so the user if they want to load the comment section or not.

Below is an example of an include HTML file which I made for usage for a dynamically loaded comment section so only when you press the button the external sites are actually loaded.  
<https://github.com/EllieTheYeen/ellietheyeen.github.io/blob/main/_includes/comments.html>

Part of `includes/comments.html`
{% raw %}
```html
<div id="disqus_thread"><button onclick="event.target.remove(); load_comments(); delete load_comments">Comments and Upvotes (DISQUS)</button></div>
<script>
    var disqus_config = function () {
        this.page.url = "{{ 'https://ellietheyeen.github.io' | append: page.url }}";
        this.page.identifier = "{{ page.id }}";
    };

    var load_comments = function () {
        var d = document, s = d.createElement('script');
        s.src = 'https://ellietheyeen.disqus.com/embed.js';
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
    };
</script>
```
{% endraw %}
You can see the button will run the function that adds the script to the page and it is not loaded before that. It is also clarified which system is used for the comment sections so users that do not want to use that service do not have to load it up either for privacy or performance reasons.

## How to make comments only appear in posts and not all pages
What we also want to do is to include that file somehow and we only want to include it in posts at least for now and not pages like the about page and such so therefore we include it in the post layout which posts use.  
<https://github.com/EllieTheYeen/ellietheyeen.github.io/blob/main/_layouts/post.html>

Part of `_layouts/post.html`
{% raw %}
```liquid
---
layout: base
---
{{ content }}

{% include disqus.html %}
```
{% endraw %}
This will ensure that only pages that are blog posts will have a section when loaded even tho technically any page could have it like even the main page.

You might also have seen that if you look at the source code for this page on GitHub that I had to use the Liquid raw tags to make sure I did not execute the liquid template engine when I showed example code since otherwise the entire contents of the page would end up in the code section.
<https://github.com/EllieTheYeen/ellietheyeen.github.io/blob/main/_posts/2023-11-03-comments-blog-disqus.md>

You should be able to see the comment section below this and upvote and comment and such.
