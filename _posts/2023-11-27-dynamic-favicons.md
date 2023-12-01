---
layout: post
title: Dynamic favicons
date: 2023-11-27 17:33
tags:
- javascript
- favicon
- html
---
Did you know that favicons on websites can be dynamic? You probably do since they are everywhere to display notifications on social media sites. We are going to look at how that is done and then implement it ourselves. At first we are going to look at a practical example of how it can look like.

You should see a button below. Try clicking on it and see it there is anything you can notice changing. If you cannot look at the browser tab (Assuming something did not break it of course). That is the favicon being changed by JavaScript.

<button class="btn" onclick="var icon = document.head.querySelector('link[rel=\'icon\']'); (icon.href.search(/faviconi/) == -1 ? icon.href='/faviconi.ico' : icon.href='/favicon.ico')">Invert</button>

The way the button works is the following. It checks if the inverted favicon is there and if not it will set it to it and revert otherwise. The code below is how it is done.
```html
<button class="btn" onclick="var icon = document.head.querySelector('link[rel=\'icon\']'); icon.href.search(/faviconi/) == -1 ? icon.href='/faviconi.ico' : icon.href='/favicon.ico'">Invert</button>
```
Here is the actual JavaScript being used for easier reading.
```js
var icon = document.head.querySelector('link[rel=\'icon\']');
icon.href.search(/faviconi/) == -1 ? icon.href='/faviconi.ico' : icon.href='/favicon.ico'
```
However there is one thing we must do. While favicons are often found by the browser sending a HTTP request like `GET /favicon.ico` automatically to every domain you visit but here we will need to explicitly define it for it to work and it is also good practice.
```html
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
```
That is what defines the icon that will later be changed in order for the icon to be changed.

There are many usages for a dynamic favicon. The most obvious example is social media sites where they might have different favicons depending on how many notifications you have but you could have stuff like one that changes when your 3D printer is done on [OctoPrint](https://octoprint.org/). 

Take note of what other websites you see using dynamic favicons and maybe you want to make a website using one yourself.
