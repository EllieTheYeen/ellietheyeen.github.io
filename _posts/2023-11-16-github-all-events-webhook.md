---
layout: post
title: How to subscribe to all GitHub events through WebHooks
date: 2023-11-16 09:17
---
So you might have noticed that on every repository on your GitHub you are able to put a webhook url that gets called whenever an event happens. To put a webhook on every project and then put on every new project can be an annoyance and what if I told you there is a way to subscribe to every single repository event on your GitHub projects?

What you first want to do is go to go to the developer settings on GitHub and create an application if you do not already have one.  
<https://github.com/settings/apps>  
Next you need to fill in an app name and this can be anything really. In Homepage URL just put the URL of your website. Now scroll down to the webhook section and enter your webhook URL which is whatever webhook you set up for your app and press active. This is compatible with the webhooks you put on respositories. Unless you intend to have many users there is no more you need to fill in here so press save.

Next you need to go to the permissions and events section and give the app some permissions. What you will need here is at least read only content access under repository permissions. After that you should scroll down and press in whatever events you want to subscribe to such as push. Now press save and go to the "install app" section and press install for yourself or update permissions if you already have it installed and give it the permissions for the repositories such as all if you want to get events for all.

## What would I put in the webhook URL?
So there is many options here where I recommend that you put something you have on your server. Personally I have something on a VPS that sends down all events through a WebSocket to one of my Raspberry Pis. I have used Heroku and Amazon IoT for this in the past but I changed once I managed to overload a Heroku instance using a Facebook WebHook.

Here is a fun fact. You are able to put a Discord WebHook url in the webhook url in github as long as you append /github to the webhook. It looks like this `https://discord.com/api/webhooks/[REDACTED]/[REDACTED]/github` where the redacted parts have the channel and token Discord gives you by default but note the `/github` part which is required for it to work.

Here is an example how it looks like in a Discord channel if it is set up that way  
![2 Discord messages that says they are from GitHub using the GitHub logo and each of them says that there is a new commit and first one is test branch main from EllieTheYeen Test commit for update and second one is from github-actions commiting the same on the posts branch](/images/discordhookexample.png "Two commits shown on Discord from a bot")

## Roll your own receiver
You can make your own reciever for webhooks which us recommended and you can use PHP do to something like this if where you send messaged to Redis using the Predis PHP library and you can have a query parameter for security so people cannot insert fake data if they find your PHP script there.
```php
<?php
$ent = filter_input(INPUT_GET, 'key');
$appkey = '[REDACTED]';
if ($ent !== $appkey) exit('No');
echo 'Yes';
require '/usr/share/php/php-nrk-predis/autoload.php';
$c = new Predis\Client();
$channel = 'aii.githubapphook';
$c->publish($channel, file_get_contents('php://input'));
```
Most webhook data is digitally signed using [HMAC](https://en.wikipedia.org/wiki/HMAC) and you can use this to verify the correctness of the message. Here is a simple example of how that could be done inside the WebHooks of Dropbox as an example
```php
$secret = '[REDACTED]';
$headers = getallheaders();
$signature = @$headers['x-dropbox-signature'];
$input = file_get_contents("php://input");
$hmac = hash_hmac('sha256', $input, $secret);
```
This way you get a more secure endpoint for your data. Make sure it works tho so you do not get no data on bad signature like setting the wrong secret. It is also good to note thet GitHub uses JSON format only for these kinds of webhooks as opposed to repository WebHooks that can either use form urlencoded or JSON. There are also other WebHooks systems like [PubSubHubbub](https://github.com/pubsubhubbub/PubSubHubbub) that uses XML data instead as YouTube uses for new video notifications from channels.

## Actually handling the data
I tend to recieve and process the data using my program [IOTReact](https://github.com/EllieTheYeen/IOTReact) after it is recieved and send through Redis. As it is easy to handle JSON data in Python and in my [Mastodon comment section](https://ellietheyeen.github.io/2023/11/14/github-pages-mastodon-comments.html) article there are some example code of what you can do to process it.

Now the question is what you might want to do with the data. You can just send it to Discord or Slack that already has some compatibility with GitHub WebHooks or you could process them and have them in a different format inside chats or filter out some events that you do not want. Some of the events that you can subscribe to on GitHub are security warnings for various applications and libraries which can be interesting.

What I use my WebHooks for is the [Mastodon comment section](https://ellietheyeen.github.io/2023/11/14/github-pages-mastodon-comments.html) and my [RSS poster](https://ellietheyeen.github.io/2023/10/29/Making-a-simple-RSS-to-Mastodon-poster-powered-by-GitHub-hooks.html) but I am sure you can come up with many new useful things you can do with monitoring your repositories and other things on GitHub and on other websites too.

WebHooks are a great way to have communication between different applications on the open web where sites can talk to each other and automatically respond to events. It can be hard to define what a WebHook exactly is but in general I would say it is a endpoint you set up to recieve events as opposed to a standard web API made to be specifically called in order to fetch data as the direction of where the data is sent defines it and also who wants to have the data recieved.

Feel free to tell what fun projects you have made using WebHooks.

*Mweeoops*
