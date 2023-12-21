---
layout: post
title: How to enable browser notifications in the local network
date: 2023-12-21 13:12 
tags:
- javascript
---
The browser notification API is a bit quirky that it either requires either that you are from localhost or that you have a valid ssl certificate. There is however a way around it that involves using a self signed certificate. There are [many guides](https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-apache-in-ubuntu-20-04) how to set up such a certificate but it depends on what browser you have.

There are certain cases where you might want to use the browser notification API either in testing cases or if you have something local in your network that you want to be able to sent notifications. Here is how you can set it up. Start with setting up so your local network page can be accessed through https using the self signed certificate which you can either do by changing things in the web server itself or set up a [reverse proxy](https://www.digitalocean.com/community/tutorials/how-to-use-apache-http-server-as-reverse-proxy-using-mod_proxy-extension-ubuntu-20-04) so you can do that.

Now the next step is enter the page and make sure the URL starts with https. Now the browser will complain and say that the site is not secure but if you click some menu like "more info" you will usually be able to accept that certificate and the page should load. Now when the page loads paste the following into the console. It will create a single button that you can click to request the notification

```js
document.write('<button onclick="Notification.requestPermission()">Request</button>') 
```

After this you should be able to use the notification API even tho you do not have a valid certificate and probably also use other features too that require HTTPS like web workers. Now try it out by pasting the following code in the console and you should see a popup in your operating system.

```js
new Notification("Test", {body: "Something"})
```

If you saw it then yes you know it works and you can make your local page for whatever you are testing maybe you have some 3D printer server or just some testing environment. Now you can look at the page for the [Notification API](https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification) and see how you set up the rest for your application where you will now be able to send notifications when you want to
