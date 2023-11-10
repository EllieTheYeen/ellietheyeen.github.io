---
layout: post
title: GitHub profile and other special repositories
date: 2023-11-10 13:16 +0100
---

GitHub has 3 special repositories each user or organization can have which does special things if created. The 3 of these are `username` that should have the same name as your username, `.github` and `username.github.io` where username should be your username in lowercase. These have various useful features that are very useful if you use GitHub a lot.

## username (Your profile)
This should have the same name as your username and if a `README.md` exists in this it will appear on the top of your profile.
An example of this in action is [my own profile](https://github.com/EllieTheYeen) where you will see a small bio.

You can have an extremely fancy profile using this with pictures and buttons and links and all kinds of fun things you can think of.

You can see some examples of some users with extremely fancy profiles [here](https://github.com/bylickilabs), [here](https://github.com/omololevy) and [here](https://github.com/ossamamehmood).

## .github (Special files)
This can used for all kinds of things like issue templates and such and organization profile readmes. [Here](https://www.freecodecamp.org/news/how-to-use-the-dot-github-repository/) is an article about it.

There are a whole bunch of special files on GitHub that can be hosted there and there are many documents like [this](https://github.com/joelparkerhenderson/github-special-files-and-paths) describing it  
and you can make those configurations apply globally on your account or organization using it.

This is great if you have an organization with many projects and want to have the same issue template for all of them.

### profile/README.md (Organization readme)
This is a very useful file inside the .github repository. For a good example let's look at [this organizations profile](https://github.com/react-native-elements). Then we look at the [readme](https://github.com/react-native-elements/react-native-elements/blob/next/README.md) with the same name as the organization. As you see they do not match. The reason for it is that the profile readme is [here](https://github.com/react-native-elements/.github/tree/master/profile/README.md) instead.

As you see if you have a organization you can place your bio section in this file and everyone who visits your organizations profile can go there and see it.

## username.github.io (GitHub pages)
GitHub pages uses this for example my own blog here that you are reading now is an example.
You can read about it at  
<https://pages.github.com/>  
Essentially what it is is that you can host your website with static content on GitHub with content generated by [Jekyll](https://jekyllrb.com/) and you can have blogs and whatever you want there with an rss feed and the only real restriction is that you cannot have dynamic things like PHP there.

It is recommended if you use this to put all kinds of things to make a website work well like `favicon.ico`, `robots.txt` and some form of index. I wrote an [article](/2023/11/05/the-mysteries-of-the-webroot.html) about things often found in the webroot of websites which I recommend reading.

If you have other projects then they can have their own path on your GitHub pages like if you have a project named test it might exist at username.github.io/test/

If you clone any repository that has GitHub pages active it will generate and be placed in the path that the project is named.

### _config.yml (Jekyll configuration)
This is the [configuration](https://jekyllrb.com/docs/configuration/) file for Jekyll which is a [YAML](https://en.wikipedia.org/wiki/YAML) file you can set all kinds of options in like the theme.

### _posts (Jekyll posts)
Here you should have files that represents posts on your Jekyll site and they have the format like `2023-10-27-blog.md`.

### _layouts (Jekyll layouts)
Used for different pages having different layouts like for example a post might start like this
```yaml
---
layout: post
---
```
and it will include post.html.

### _includes (Jekyll includes)
Used for when a page has a section like this
```liquid
{% raw %}{% include share.html %}{% endraw %}
```
and it will default to this folder.

There are probably way more things like this deep in the documentation but these are the ones I have found so far and found useful.

*Mweeoops*