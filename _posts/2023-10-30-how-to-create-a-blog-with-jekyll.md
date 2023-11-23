---
title: How to create a blog with Jekyll and GitHub Pages
date: 2023-10-30 04:58:28 +0100
tags:
- github
- jekyll
- liquid
---

GitHub pages is a free and quite easy way to set up a free website. It comes with many fun features like many themes you can install. What it supports is jekyll which allows you to automatically have GitHub build the HTML files for you using markdown. There are also many plugins such as [Jekyll-Feed](https://github.com/jekyll/jekyll-feed) that create a RSS XML file for you

At first we are going to look at various directories and files that need or is good if exists in order for this to function properly.

* 
{:toc}

## _posts
This directory is used by jekyll-feed to store individual posts.
the format of the files must be `YYYY-MM-DD-title.md`
and you can use the Python date format code `%Y-%m-%d` to generate that format.

Here is an example of a post
```yaml
---
layout: post
date: 2023-10-27 02:53:40 +0200
title: A title
---
Text here using markdown format
```
### layout: post
This is to set the layout to use for the post and it must exist in the `_layouts` folder

### date: 2023-10-27 02:53:40 +0200
This is to specify the date when the post was posted. You can use the following Python snippet to generate a date in that format. If the date is specified in here it will take priority over the date in the file name.
```python
import datetime

tz = datetime.timezone(
    # Replace this with your timezone
    datetime.timedelta(hours=2)
)
now = datetime.datetime.now()
now = now.replace(tzinfo=tz)
```

title: A title
This is used to set the title of the page. This will take precedence over the title in the filename but the title in the filename will be used for the URL

## _layouts
Contains various html files used to describe the layouts different pages can have. These support inheritance where you can specify that one layout should inherit from another and this can be done in multiple levels too. This is very good if you want to for example have a certain category of pages where all of them have certain elements

## _includes
Used to store the layouts and will be accessed whenever you do something like {% raw %} `{% include footer.html -%}` {% endraw %} inside a HTML file

## _config.yml
This is the main config file for jekyll

```yaml
theme: jekyll-theme-hacker
title: YeenDeer softness blog
description: >-
  A YeenDeer is soft

plugins:
  - jekyll-relative-links
  - jekyll-feed

relative_links:
  enabled: true
  collections: true
```

## Gemfile
This is a file used by Ruby's package manager Gem to find packages to install.
You can install the packages inside it by writing `bundle install`.
The code in this example is what I use to run my blog locally when updating

```ruby
source "https://rubygems.org"
gem "jekyll-theme-midnight"
gem "github-pages", group: :jekyll_plugins
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.12"
  gem "jekyll-relative-links"
end
```
You do not need this file per say but it is very convenient to have it there in case you want to locally run your blog when updating it
## .gitignore
A part of git and if you run your blog locally when testing it is really recommended to have a gitignore with at least `_site` inside it to not have your local builds uploaded but rather let GitHub do it
```
_site
.sass-cache
.jekyll-cache
.jekyll-metadata
vendor
Gemfile.lock
```
## favicon.ico
[![A small figure resembling a creature](/favicon.ico "A small figure resembling a creature")](/favicon.ico)

A small picture that will be shown in the browser tab and it is really recommended to have one for people to recognize your blog among tabs. You can put any small picture there

## _site
This is where generated site components will end up when they are generated. it is very inadvicable to write things here

## Other files
You can have any file you want in the root directory and it will be processed by the [Liquid](https://shopify.github.io/liquid/) endinge and copied over to the _site directory.

You can for example write a file named `listsposts.json` with the following content.
```liquid {% raw %}
---
---
{
  {%- for p in site.posts %}
    {{ p.title | jsonify }}: {{ site.url | append: p.url | jsonify }}
    {%- unless forloop.last %},{% endunless -%}
  {% endfor %}
} {% endraw %}
```
And it might generate something like the following accessible on the web like `/listposts.json` with the following content.
```json
{
    "How to create a blog with Jekyll and GitHub Pages": "https://ellietheyeen.github.io/2023/10/29/how-to-create-a-blog-with-jekyll.html"
}
```

## Testing locally
First make sure you have jekyll installed. it is a ruby gem so if you have ruby installed you can write `gem install jekyll`.
You should also make sure to install bundler using `gem install bundler`.
If you do not have Ruby you should install it first from <https://www.ruby-lang.org/> or use a package manager if there is one you can use for it on your current system.

Now you should make a directory where you want to run jekyll and go into it and run `jekyll new .` which will create the files needed to run and then you can run either `jekyll serve` or `bundle exec jekyll serve` to run it which will start a web server accessible from localhost.

At times there might be issues that you will run into. On Windows I had the issue where it complained over the webrick gem being missing but I solved it by adding the line `gem "webrick"` to `Gemfile` and make sure to run it using `bundle exec jekyll serve`.  

On Windows I tend to use the command  
`cmd /c bundle exec jekyll serve --livereload`  
as Ruby on Windows in cygwin tends to not run that well in certain situations with libraries that need to be found and on Linux  
`bundle exec jekyll serve -H 0.0.0.0 --livereload`  
The reason for this is that the `--livereload` argument will automatically reload your page when you save a file and `-H 0.0.0.0` will make it visible from other hosts as I run it on a Raspberry pi at times.

Remember that a lot of files are placed there automatically like if you set a theme in _config.yml the files for the theme will automatically be downloaded.  
If this is locally you tend to need to install the theme and put it in the `Gemfile`.

## How to actually post
What you do when you want to make a post is create a new file in the _posts folder dated accordingly with and with at least the layout setting filled since otherwise there will be no loaded templates for your post. After that you just have to write whatever you want and when you are done you push to the `gh-pages` branch (As of now the main branch seens to work too if set up that way in repository settings) and GitHub will build it for you and update within a few seconds. You can use GitHub hooks to have things react to your blog being updated and act accordingly.

You should know a bit of markdown in order to make posts but that is something that is very easy to learn. You have perhaps used a chat service such as Discord which has support for markdown.

There are many jekyll themes you can look at at <http://jekyllthemes.org/> which makes it very convenient if you do not want to make your own design.

Good luck and free to ask any questions *Mweeoops*
