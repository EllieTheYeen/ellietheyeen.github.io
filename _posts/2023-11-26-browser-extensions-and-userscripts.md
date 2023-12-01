---
layout: post
title: Browser extensions and userscripts
date: 2023-11-26 23:26
tags:
- javascript
- userscripts
- browserextensions
---
It is very easy to make browser addons for Chrome and Firefox. It has a simple and concise JavaScript API that is almost identical between them. You can always look at the API reference for [Chrome](https://developer.chrome.com/docs/extensions/reference/) and [Firefox](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Browser_support_for_JavaScript_APIs) if you have no idea what to do.

We are going to look at a simple extension to pin images from the context menu and how it is made. In order for a browser extension to work we generally need 3 different files.
1. A manifest defining the various features and telling where to find the other files
2. An icon or a few to be used in different parts of the extension such as a favicon
3. Some code file that is JavaScript to contain the actual code and it can be more than one

Here is an example of a manifest file for the addon that lets you click on images and pin them as tabs. As you see it specifies where to find other files such as the icon and the script file and also what API's to use and as you can see here it specifies tabs and contextMenus which we will need for the extension. There are also other things such as the name and the manifest version and internal version of the extension which is good for debugging published extensions.

`manifest.json`
```json
{
  "manifest_version": 3,
  "name": "Image to pinned tab",
  "description": "This extension allows you to pin images to tabs",
  "version": "1.0",
  "browser_specific_settings": {
    "gecko": {
      "id": "imagetopinnedtab@example.com"
    }
  },
  "background": {
    "scripts": ["app.js"]
  },
  "icons": {
    "128": "icon.png"
  },
  "permissions": [
    "contextMenus",
    "tabs"
  ]
}
```
As we have now specified the script file we are going to take a look at it. It creates a context menu and also has various code in order to compensate for issues that can happen when registering the context menu. The commented away code had some issues with it so it was removed. It is also slightly different how Chrome and Firefox handles this.

`app.js`
```js
function onPin(a) {
	var src = a.srcUrl
	if (src === undefined) src = a.linkUrl
	chrome.tabs.create({ url: src, pinned: true, active: false })
}

//chrome.runtime.onInstalled.addListener(() => {
chrome.contextMenus.create({
	"title": "Pin",
	"id": "1",
	"contexts": ["image", "link"]
},
	() => browser.runtime.lastError,
)
//})

chrome.contextMenus.onClicked.addListener(onPin)
```
The function `onPin` here is called whenever there is a click on the context menu. It is run in 2 different contexts where one is for pictures and the other is for links and it prioritizes images where it tries to access the `srcUrl` attribute before trying to access the `linkUrl` attribute that links have.

You can also specify an id if you have several context menus handling stuff differently with a single callback and the `title` is what will be shown to the user when they open the menu. It is important to note that if there is just a single context menu option it will not open up a menu when you hold over it which is good when you want faster clicking.

In order to make this app work we need to do a few things. Let's say we want to make it for Firefox. We start by creating a zip file where we place the 3 files inside. After that we rename the zip file to .xpi and we can load it as an addon. This is however only possible in developer edition unless you sign the extension but there should be some option to temporarily load an extension to test but it will not be preserved across restarts.

I really do recommend using [Firefox Developer Edition](https://www.mozilla.org/en-US/firefox/developer/) since it is really great when developing extensions and other things. If you on the other hand use Chrome there should be an option to just load a folder as an extension and it will even be preserved across restarts which is good for when you make a small extension for personal use.

If you have followed all instructions here you should have a small extension that works that allows you to pin images to pinned tabs which is really convenient for when you are browsing images and want to take a closer look at some of them with fewer clicks.

If you want to on try out some other fun things related to extensions you can try the extension [Tampermonkey](https://www.tampermonkey.net/) which allows you to run userscripts which are small scripts that can be specified to run on different websites according to a regex. I made a useful things called [VRChat online announcer](https://gist.github.com/EllieTheYeen/85776ad20218db29c7d33e12ce58be29) using this which is a userscript that reads out loud using text to speech who comes online and goes offline on your friends list and also when you get new notifications. This is really great for when you use a VR headset and want to know when certain friends come online.

Here below should be a preview of the script if you want to take a look at it.
{% gist 85776ad20218db29c7d33e12ce58be29 %}

It can be very fun and also useful to make extensions and userscripts for your browser. There are many other things you can do such as if you just want to change color of an annoying element which you can do like the following.

`tootcatblack.js`
```js
// ==UserScript==
// @name         TootcatBlack
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://toot.cat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=toot.cat
// @grant        GM.addStyle
// ==/UserScript==
GM.addStyle("textarea { background-color:#000 !important; color: #FFF !important; } .compose-form__buttons-wrapper {background-color: #000 !important; }");
```

Or maybe you want to stay away from the awful feed on Twitter by making so you are redirected back to notifications if for any reason you end up on the home feed.

`notwitterfeed.js`
```js
// ==UserScript==
// @name         No feed
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Redirects you away from the toxic Twitter home feed
// @author       You
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        window.onurlchange
// ==/UserScript==

(function() {
    'use strict';

    function checkandmove(href) {
        if (href === 'https://twitter.com/home') {
            document.location = 'https://twitter.com/notifications';
        }
    }

    window.onurlchange = (d) => checkandmove(d.url);
    checkandmove(document.location.href);
})();
```

These are just small examples of many fun and useful things you can do using JavaScript with extensions and userscripts in the browser and feel free to tell in teh comments if you have made anything fun using them.
