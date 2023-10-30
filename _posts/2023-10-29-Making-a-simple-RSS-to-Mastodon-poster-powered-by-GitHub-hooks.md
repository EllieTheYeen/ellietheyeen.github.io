---
layout: post
date:   2023-10-29 22:45:26 +0200
title:  Making a simple RSS to Mastodon poster powered by GitHub hooks
---
Decided to make a simple RSS to Mastodon poster powered by GitHub hooks.

Used pathlib for this as it is a very convenient thing to use as you can do somepath / 'some string to join'.

Now all new posts made here will end up automatically posted on social media and since there is a crossposter that I made connected to the Mastodon it will end up on Twitter and Bsky too.

It runs when the GitHub hook `completed` runs and it is limited to max check each feed every 60 seconds and only do a single post if multiple are found.

See the code below how it was done and feel free to use it
{% gist 931004c78808b3d52daf7723cb6453fd %}
Apparently you can preview gists like this which is nice.  
The syntax for it is {% raw %} `{% gist 931004c78808b3d52daf7723cb6453fd %}` {% endraw %}
where you post the if of the gist such as
931004c78808b3d52daf7723cb6453fd part from <https://gist.github.com/EllieTheYeen/931004c78808b3d52daf7723cb6453fd>

