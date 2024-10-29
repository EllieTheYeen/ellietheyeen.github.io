---
layout: post
title: Downloader browser extension for aria2
date: 2024-10-29 00:00
tags:
- browserextensions
- javascript
- apache
- proxy
- aria2
---


So previously we looked at how to [hardlink downloaded files in aria2](/2024/10/28/hardlink-finished-files.html) but this time we are going to look how to make a simple browser extension to quickly add anything you want to the download queue.

For this I recommend you use [Mozilla Firefox Developer Edition](https://www.mozilla.org/en-US/firefox/developer/) and go into `about:config` in the address bar and set `xpinstall.signatures.required` to `false` or you can use Google Chrome. The reason for this is that if you use the standard Firefox it will not properly accept unsigned plugins or it might uninstall them whenever you restart Firefox.

* 
{:toc}

## CORS and config issues

Next there is a thing we must get to function and that is CORS which stands for Cross Origin Resource Sharing and that is a special set of headers to send client side HTTP requests inside a browser to a different domain than the page is on.

There is a in `aria2.conf` that will supposedly fix that
```ini
rpc-allow-origin-all=true
```
that is if it actually helped in this situation. I never got this to properly to work and it seems that one of the issues is that it really does try to use HTTPS at all times which breaks things. There are some things that should be possible in setting the setting `rpc-secure` to fix things but that requires many options to be set properly so we are doing it another way.

## Apache as CORS proxy

What we are going to do instead as a workaround is make an apache CORS proxy. Start by making sure you have apache installed which you can install by using
```sh
sudo apt install apache2
```
Next we must make sure certain mods are enabled with the following command
```sh
sudo a2enmod headers proxy_http ssl
```
Now outside any VirtualHost section we should set this and it can sort of be inside any .conf file in `/etc/apache2/apache2.conf` in the end
```apache
<Location /ariarpc>
  ProxyPass http://127.0.0.1:6800/jsonrpc
  Header setifempty Access-Control-Allow-Origin "*"
  Header setifempty Access-Control-Allow-Headers "*"
</Location>
```
Now we must create a `VirtualHost` section for the SSL that the extension we are creating insists on using. It tends to exist at `/etc/apache2/sites-enabled/000-default.conf` so creating another virtual host there or in a file beside it might be good but ensure both virtual hosts exists where one has the content below.
```apache
<VirtualHost *:443>
        SSLEngine on
        SSLCertificateFile    /etc/ssl/certs/ssl-cert-snakeoil.pem
        SSLCertificateKeyFile /etc/ssl/private/ssl-cert-snakeoil.key
        SSLCertificateChainFile /etc/ssl/certs/ssl-cert-snakeoil.pem

        ServerName smol

        ServerAdmin webmaster@localhost
        DocumentRoot /var/www/html

        <Directory /var/www/html>
            AllowOverride All
        </Directory>

        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```
There is a risk that the selt signed cert is not there but you can [generate it with the openssl command](https://www.baeldung.com/openssl-self-signed-cert) if needed.

Now we only need to restart apache and go to `https://192.168.0.44/ariarpc` or whatever the address is to your host and press to accept the fault certificate which we will need to have accepted for the extension to b e able to use it.

## The extension
Now for the actual extension we need to create a zip file that has no subdirectories but does contain a few files called `manifest.json`, `icon.png` and `background.js`. For the icon just make anything really an image that is maybe 100x100 or so. In the manifest we can place the following to make sure the permissions are right and everything.

`manifest.json`
```json
{
    "background": {
        "scripts": [
            "background.js"
        ]
    },
    "action": {
        "default_icon": "icon.png",
        "default_title": "Share"
    },
    "browser_specific_settings": {
        "gecko": {
            "id": "downloadaddon@example.com"
        }
    },
    "description": "Download Addon just for testing",
    "icons": {
        "128": "icon.png"
    },
    "manifest_version": 3,
    "name": "Download Addon",
    "permissions": [
        "contextMenus",
        "notifications"
    ],
    "host_permissions": [
        "<all_urls>"
    ],
    "version": "1.0"
}
```

The actual script here will do the thing of creating a context menu with you can open with the second mouse button over links or images or pages and then it should send the request to your NAS or whatever has apache and aria2 on it but make sure to set the password and the address in the line with `xhr.open` in it.

`background.js`
```js
function context(event, tab) {
    var url = event.pageUrl;
	if (event.menuItemId === "link") {
		url = event.linkUrl;
	} else if (event.menuItemId === "image") {
		url = event.srcUrl
	}

	var data = {
		"jsonrpc": "2.0",
		"id": "whatever",
		"method": "aria2.addUri",
		"params": [`token:${token}`, [url]],
	};

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState !== 4) return;
		console.log(xhr.responseText);
		chrome.notifications.create(null, {
			"message": xhr.responseText,
			"title": "Download",
			"iconUrl": "icon.png",
			"type": "basic",
		})
	};
	xhr.open("POST", "http://192.168.0.44/ariarpc");
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send(JSON.stringify(data));
}

browser.contextMenus.create({
	"title": "Download page",
	"id": "page",
	"contexts": ["page"]
},
	() => void browser.runtime.lastError,
);

browser.contextMenus.create({
	"title": "Download link",
	"id": "link",
	"contexts": ["link"]
},
	() => void browser.runtime.lastError,
);

browser.contextMenus.create({
	"title": "Download image",
	"id": "image",
	"contexts": ["image"]
},
	() => void browser.runtime.lastError,
);

browser.contextMenus.onClicked.addListener(context)

var token = "YourPasswordHerePleaseChange";
```

Now all of the 3 files should be inside the zip and now you are going to rename the zip file to anything with the `.xpi` ending and next you can run it inside Firefox Developer Edition by dragging it into tab or setting xpi files to run using it. Now go to any page and second clicking on anything at all like a link, an image or the page it self will give you a context menu to download it. Tell how your experience was in the comments if you decide to try this.
