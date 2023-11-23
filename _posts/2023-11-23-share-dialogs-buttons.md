---
layout: post
title: Share dialogs and buttons
date: 2023-11-23 04:49
tags:
- html
- seo
- robots.txt
---
On many websites there are buttons to share an article to other sites or to chat services. This is done in the browser either by linking to the website and passing parameters about the post to share or a protocol handler might be used when there is an actual application installed. In the case of email for mailto links it is really any mail that has it registered. We are going to look at different sites dialogs and how the link is constructed.

To make a button for it there are a few ways where one is JavaScript that runs when a button is pressed and opens a popup and the other is a simple link. I always recommend a simple link as is way more accessible and good if someone uses multi account containers or are not using JavaScript on your website.

Here is a long list of different found URLs for different sites that allow sharing and some of the details of how they work.

* 
{:toc}

## Types of parameters
Below is a table of types of parameters you might find inside a share dialog URL. 

type | explanation
|:-:|
body | The body of the post can be set with this and might include URLs
title | Sets the title of the post the user makes
enum | Has a fixed set of values it must be set to
csv | Comma separated values usually used for tags
URL | An URL to be linked to in the post
image | An URL pointing to a picture

Some of them might be required even to they do not seem to be and some of them are hard to test.

## Email
Yes you can make a share dialog using email by not filling out the to section

parameter | type | required | comment
|:-:|:-:|:-:|:-:|
subject | title | no | The email subject
body | body | no | Whatever for there to be in the body of the email

Example: <mailto:?subject=Share Buttons&body=Share%20dialogs%20and%20buttons%0Ahttps://ellietheyeen.github.io/2023/11/22/share-buttons.html%0A>

## Mastodon
Mastodon is the toughest one to really get working as there are many instances and you cannot know what instance the user is on without asking the. You can look at the source of this site in order to know how it is done here and try out the button for yourself.

parameter | type | required | comment
|:-:|:-:|:-:|:-:|
text | body | yes | Whatever to fill the post window with

Example: <https://toot.cat/share?text=https://ellietheyeen.github.io/2023/11/22/share-buttons.html%0AShare%20dialogs%20and%20buttons>

## Tumblr
Tumblr is certainly a website and you can share stuff to it if you want

parameter | type | required | comment
|:-:|:-:|:-:|:-:|
posttype | enum | yes | Should be set to link
canonicalUrl | URL | yes | The URL
title | title | no | Good to set
caption | body | no | This will make it look like the user filled it out
content | body | no | Avoid filling this out unless you make another type of post
tags | csv | no | sets the tags

Example: <https://www.tumblr.com/widgets/share/tool?posttype=link&canonicalUrl=https://ellietheyeen.github.io/2023/11/22/share-buttons.html&title=Share%20dialogs%20and%20buttons&caption=&content=&tags=>

## Twitter
Sharing on Twitter is a good choice since it is a popular platform even tho the platform itself has huge issues especially lately

parameter | type | required | comment
|:-:|:-:|:-:|:-:|
text | body | no | It is possible to place URL's here
url | URL | no | You can either put it here or in the body
hashtags | csv | no | Sets the hashtags to be used in the post

Example: <https://twitter.com/intent/tweet?url=https://ellietheyeen.github.io/2023/11/22/share-buttons.html&text=Share%20dialogs%20and%20buttons>

Note: Twitter also has other intent links such as a message a specific user one  
<https://twitter.com/messages/compose?recipient_id=1321524266727297032&text=Wow%20I%20love%20this%20article%2C%20it%20is%20so%20well%20written%0Ahttps://ellietheyeen.github.io/2023/11/22/share-buttons.html>

## Reddit
Allows readers to share your article to a subreddit or their own profile

parameter | type | required | comment
|:-:|:-:|:-:|:-:|
url | URL | no | will fill the post content field and stuff other than URL's can be put here
title | title | no | Sets the title of the post

Example: <https://reddit.com/submit?url=https://ellietheyeen.github.io/2023/11/22/share-buttons.html&title=Share%20dialogs%20and%20buttons>

## Facebook
Sharing on Facebook is quite easy and a big social media site too so you might get quite some reach here

parameter | type | required | comment
|:-:|:-:|:-:|:-:|
u | URL | yes |

Example: <https://www.facebook.com/sharer.php?u=https://ellietheyeen.github.io/2023/11/22/share-buttons.html>

Note: Another URL exists for this but it does require an app id to be set but as I have no Facebook account and the person having the website might not either it might not work.  
Example: <https://www.facebook.com/dialog/share?href=https://ellietheyeen.github.io/2023/11/22/share-buttons.html>

## Pinterest
Good for image posts so users can share them there but not as good for other posts

parameter | type | required | comment
|:-:|:-:|:-:|:-:|
url | URL | yes | the URL to link to
media | image | sort of | should be set to a picture
description | body | no | fills the body section

Example: <http://pinterest.com/pin/create/link/?url=https://ellietheyeen.github.io/2023/11/22/share-buttons.html&media=https://github.com/EllieTheYeen.png&description=Share%20dialogs%20and%20buttons>
Note: Requires either an URL to some media or the user uploading some picture for it to work

## Telegram
Have users share your post on Telegram

parameter | type | required | comment
|:-:|:-:|:-:|:-:|
url | unknown | unknown | Not been able to test this since no account

Example: <https://telegram.me/share/url?url=https://ellietheyeen.github.io/2023/11/23/share-dialogs-buttons.html>

Note: Also has a protocol handler like this:  
<tg://msg_url?url=https://ellietheyeen.github.io/2023/11/23/share-dialogs-buttons.html>

## Ycombinator
Or Hacker news. I do not know much about this site but it does have a share dialog.

parameter | type | required | comment
|:-:|:-:|:-:|:-:|
u | url | yes |
t | title | no |

Example: <https://news.ycombinator.com/submitlink?u=https://ellietheyeen.github.io/2023/11/23/share-dialogs-buttons.html&t=Share%20dialogs%20and%20buttons>

## Blogger
Have your readers blog about your post

parameter | type | required | comment
|:-:|:-:|:-:|:-:|
n | unsure | yes? | Seems to fill out both title and body and newlines seems to be broken in it

Example: <https://www.blogger.com/blog_this.pyra?n=Share%20dialogs%20and%20buttons%0Ahttps://ellietheyeen.github.io/2023/11/23/share-dialogs-buttons.html%0A>

## Pocket
Let readers save your posts for later reading

parameter | type | required | comment
|:-:|:-:|:-:|:-:|
url | URL | yes |

Example: <https://getpocket.com/edit?url=https://ellietheyeen.github.io/2023/11/23/share-dialogs-buttons.html>

Note: Seems to automatically save without asking the user first and also there tends to be a "Save to Pocket" button in Firefox built in

## Instapaper
Not confirmed functioning but this is what has been observed

parameter | type | required | comment
|:-:|:-:|:-:|:-:|
url | URL | yes? |

Example: <https://www.instapaper.com/edit?url=https://ellietheyeen.github.io/2023/11/23/share-dialogs-buttons.html>

## Pinboard
Not confirmed functioning but this is what has been observed.

parameter | type | required | comment
|:-:|:-:|:-:|:-:|
url | URL | yes? |

Example: <https://pinboard.in/add?url=https://ellietheyeen.github.io/2023/11/23/share-dialogs-buttons.html>

## GMail
Yes you can make a button that opens GMail ready to send a mail

parameter | type | required | comment
|:-:|:-:|:-:|:-:|
body | body | yes | What to put in the body
fs | unknown | yes | Should be set to 1
tf | unknown | yes | Should be set to cm

Example: <https://mail.google.com/mail/u/0/?fs=1&tf=cm&body=Share%20dialogs%20and%20buttons%0Ahttps://ellietheyeen.github.io/2023/11/23/share-dialogs-buttons.html%0A>

## Notes
Not all sites have share dialogs such as Bsky does not have one unless that has changed and cohost I have not been able to confirm. Some also have extremely broken ones that sort of work but not really such as wordpress with the url parameter that tries to embed a post somehow  
https://wordpress.com/post/?url=https://ellietheyeen.github.io/2023/11/22/share-buttons.html
If you make your own social media site or anything like it I do recommend making your own dialog like that.

There are also some browser addons that add buttons with share dialogs to every website and I even made my own that adds a mastodon share button to every website.

I found quite a few share buttons here if you do not care about making your own  
<https://elfsight.com/social-media-share-buttons>

Be very sure that you have your meta tags like open graph and others set up correctly since it is very useful for previews on other sites to work correctly. [Here is an article I wrote about that](https://ellietheyeen.github.io/2023/11/17/open-graph-oembed-order.html) and also make sure random robots can read the `robots.txt` for preview it since they do obey it typically

I would be extremely suprised if someone somehow managed to press all the buttons below
