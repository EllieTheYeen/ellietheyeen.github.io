---
layout: post
title: OpenGraph and oEmbed. Who? What? Why? When? Where?
date: 2023-11-17 04:14
---
So when you paste a link into a social media site or a chat app a certain thing tends to happen. The app sends a bot to the site in order to look at it and see what it is and if it is a picture maybe they will display it too you and the others in chat and if it is a HTML page it will find some meta tags and similar data in order to give you a preview in chat for everyone to view.

There are many apps and sites to consider as they all display the preview in a sligthly different way and as you want your website to look as impressive at possible probably want to know all the rules of how it works. Today we are going to focus on apps like Slack, Discord, Twitter, Bsky and Mastodon.

In order to test this we need to specifically craft some HTML file for [OpenGraph](https://ogp.me/) and a JSON file for [oEmbed](https://oembed.com/) that makes it extremely obvious what is happening from the preview.
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <title>title</title>
    <meta name="og:title" content="og:title" />
    <meta name="og:site_name" content="og:site_name" />
    <meta name="og:image" content="https://randomness.nu/ogtest/og.png" />
    <meta name="twitter:card" content="summary" />
    <meta name="description" content="description
second line of description to see if this works" />
    <!-- Below are not required but good to have -->
    <meta name="og:description" content="og:description
It is possible to put many lines here in og:description by placing actual lines in the HTML document
In fact Mastodon does the same with alt text and it works very good
It does make the HTML look messy but it is really good for Discord
Anyway this is some filler text that is useful to see how long descriptions are previewed" />
    <meta name="theme-color" content="#FFAAFF" /> <!-- Discord embed color -->
    <meta name="author" content="author" />
    <meta name="og:type" content="article" />
    <meta name="twitter:title" content="twitter:title" />
    <meta name="twitter:image" content="https://randomness.nu/ogtest/twitter.png" />
    <meta name="twitter:description" content="twitter:description
Line 2 in twitter:description here which is converted to a newline by Bsky but is converted to a space by Twitter
But only a certain amount of characters are shown anyway" />
    <meta name="twitter:url" content="https://randomness.nu/ogtest/?ref=twitter_url">
    <link rel="icon" type="image/x-icon" href="https://randomness.nu/ogtest/favicon.ico" />
    <link rel="alternate" type="application/json+oembed" title="oEmbed" href="https://randomness.nu/ogtest/oembed.json">
    <link rel="canonical" href="https://randomness.nu/ogtest/?ref=canonical" />
    
</head>

<body>
    Open graph test you can link in places to test. Press control U to see the source. <a href="https://randomness.nu/ogtest/" title="Click here">*Mweeoops*</a>
</body>

</html>
```
This file is located at <https://randomness.nu/ogtest/> and has a bunch of different pictures and such in order to be able to identify what picture we get shown whenever the preview appears and the full link of it is <https://randomness.nu/ogtest/ogtest.html>.

Here is the oEmbed JSON file
```json
{
    "author_name": "oEmbed author_name",
    "author_url": "https://randomness.nu/ogtest/?ref=author_url",
    "provider_name": "oEmbed provider_name",
    "provider_url": "https://randomness.nu/ogtest/?ref=provider_url",
    "title": "oEmbed title",
    "thumbnail_url": "https://randomness.nu/ogtest/oembed.png",
    "thumbnail_width": 100,
    "thumbnail_height": 100,
    "type": "link",
    "version": "1.0"
}
```

## Icons for testing
We have made 4 different icons in order to differentiate between what the site choses to use and they are:
1. Twitter icon
2. OpenGraph icon
3. Favicon
4. oEmbed icon

They are crudely drawn to not mistake for any official logo in the tests.

What we need to do now is just copy paste the link into as many chat services and social media as possible in order to see how they react and here are the results.

---
### Twitter

![A Twitter icon https://randomness.nu/ogtest/ogtest.html newline randomness.nu newline twitter:title newline twitter:description Line 2 in twitter:description here which is converted to a newline by Bsky but is ](/images/twitterpreview.png)

As expected Twitter used the Twitter meta tags and shows the picture meant for Twitter and also the host name of the website.

### Twitter tag priority order

Image:
1. twitter:image
2. og:image

Title:
1. twitter:title
2. og:title

Description:
1. twitter:description
2. og:description

Note: There must be either a twitter:title or a og:title in order for Twitter preview to work.

---
### Bsky
![A Twitter icon https://randomness.nu/ogtest/ogtest.html newline twitter:title newline https://randomness.nu/ogtest/ogtest.html newline twitter:description newline Line 2 in twitter:description here which is converted to a newline by Bsky but is converted to a space by Twitter](/images/bskypreview.png)

Bsky is a bit strange as it prioritizes twitter meta tags and even the picture if there but has a quirk that you can put newlines in the tags.

### Bsky tag priority order

Image:
1. twitter:image
2. og:image

Title:
1. twitter:title
2. og:title
3. title tag

Description:
1. twitter:description
2. meta description
3. og:description

Note: Bsky allows newlines to be kept in the description while Twitter converts them to spaces in previews

---
### Slack
![A favicon icon og:site_name newline og:title newline og:description newline It is possible to put many lines here newline in og:description by placing actual lines in the HTML document newline In fact Mastodon does the same with alt text and it works very good newline It does make the HTML look messy but it is really good for Discord newline Anyway this is some filler text that is useful to see how long descriptions are previewed](/images/slackpreview.png)

Slack will not use any image from the tags we specified but will instead use the favicon and prioritize open graph tags and allows newlines in the description.

### Slack tag priority order

Title:
1. og:title
2. twitter:title
3. title tag

Description:
1. og:description
2. twitter:description
3. meta description

Sitename:
1. og:site_name
2. twitter:site_name
3. hostname

Note: The picture is favicon

---
### Discord
![An Open Graph icon oEmbed provider_name newline oEmbed author_name newline og:title newline og:description newline It is possible to put many lines here in og:description by placing actual lines in the HTML document newline In fact Mastodon does the same with alt text and it works very good newline It does make the HTML look messy but it is really good for Discord newline Anyway this is some filler text that is useful to see how long descriptions are previewed](/images/discordpreview.png)

Discord has the fanciest preview where you can specify the color and also use oEmbed to make 2 additional links appear instead of the site name and prioritizes open graph and allows newlines in the description.

There is also a [Embed previewer](https://discord.com/developers/embeds) which makes this easier

### Discord tag priority order

Image:
1. og:image
2. twitter:image

Title:
1. og:title
2. twitter:title
3. title tag

Description:
1. og:description
2. twitter:description
3. meta description

Sitename:
1. oEmbed
2. og:site_name

Note: If oEmbed exists it will replace the site name with the provider_name and author_name with provided links. Unless you need it for some fancy Discord preview I would avoid it as it can break Mastodon previews.

---
### Mastodon
![An oEmbed icon newline oEmbed title newline oEmbed provider_name](/images/mastodonpreview.png)

### Mastodon tag priority order

Image:
1. oEmbed
2. og:image

Title:
1. oEmbed
2. og:title
3. title tag

Description:
1. oEmbed
2. og:description
3. meta description

Sitename:
1. og:site_name

Note: If oEmbed exists it will use title and provider name and the picture from it

---
## Table of all the orders the sites find tags in
Each site has their own order of fetching and using meta tags and oEmbed in order to fetch data.

Here is a table that shows the priority order of which tags are used on which site.

| Source         Site ->  | Twitter | Bsky | Slack | Discord | Mastodon |
|-------------------------|---------|------|-------|---------|----------|
| **oEmbed**              | no      | no   | no    | 1       | 1        |
|                         |         |      |       |         |          |
| **og:title**            | 2       | 2    | 1     | 1       | 2        |
| **twitter:title**       | 1       | 1    | 2     | 2       | no       |
| **meta title**          | no      | 3    | 3     | 3       | 3        |
|                         |         |      |       |         |          |
| **meta description**    | no      | 2    | 3     | 3       | 3        |
| **og:description**      | 2       | 3    | 1     | 1       | 2        |
| **twitter:description** | 1       | 1    | 2     | 2       | no       |
|                         |         |      |       |         |          |
| **og:image**            | 2       | 2    | no    | 1       | 2        |
| **twitter:image**       | 1       | 1    | no    | 2       | no       |
|                         |         |      |       |         |          |
| **og:site_name**        | no      | no   | no    | 2       | 1        |

Note: If it says 1 on oEmbed it will use that first for things

You can use this data to display different previews on different websites and also to optimize the tag usage.

## Redundancy
From this we can conclude that the absolute minimum tags we should want to use are the following to get good previews on every site listed.
```html
<title>put a title here</title>
<meta name="og:title" content="put title again here" /> <!-- Will not preview at all on twitter otherwise -->
<meta name="og:image" content="put url to image here" /> <!-- If you want an image that is -->
<meta name="description" content="description here" /> <!-- Search engines will complain if this is not here -->
<meta name="og:description" content="put description again here" /> <!-- Will not show any description on Twitter otherwise -->
<meta name="twitter:card" content="summary" /> <!-- Unless this is here no previews on Twitter will appear -->
<!-- Recommended -->
<meta name="og:site_name" content="put website name here" /> <!-- for Discord if you want a site name shown -->
<meta name="theme-color" content="#FFAAFF" /> <!-- Discord embed color -->
```
Twitter as you can see is the main one causing issues as it does not follow standards very good and has quite some issues with understanding tags and requires special treatmeant unlike all of the others.

On Twitter the meta tag can be set to the following too among other things like video players but this one displays an image large but hides all the other text in the preview and you can read about [Twitter cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards) for more info.
```html
<meta name="twitter:card" content="summary_large_image" />
```
That is if Twitter will exist for that much longer.

There are probably way more websites out there that do it completely differently and I could not try Facebook as I do not have an account there and I did not bother with Tumblr as I do not spent much time there. If you make your own previewer you should probably look at the more functioning implementations and read the description meta tag properly and such.

This comes from me spending hours debugging some Open Graph issues and trying to find out all the quirks in it and trying to figure out how certain sites such as [fxtwitter](https://fxtwitter.com/) and [vxtwitter](https://vxtwitter.com/) works when they show their previews and with vxtwitter I even had to set my user agent to the Discord bot one  
`User-Agent: Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)`  
in order to get it to respond with the correct data.

I made a open graph test PHP script that is [here](http://kserver.nu/oginfoecho.php) that just echoes back whatever bot tried to access it so I could get the user agent of different bots.

Anyway I hope you find this information useful and you can use it for your own debugging and development of open graph and previewing things in general. I learnt of the oEmbed protocol today but not sure I am a big fan of it as on a static site it is nothing that seems to work very good and some places like Mastodon does not seem to work that well with it. Also remember that whenever you test things like this it tends to be cached on the site so apply some random parameters in order to make it fetch again and copying and then pasting the URL again tends to help.

*Mweeoops*
