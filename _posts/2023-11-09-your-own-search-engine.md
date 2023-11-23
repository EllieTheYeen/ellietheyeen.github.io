---
layout: post
title: Add your own search engine in your browser
date: 2023-11-09 12:34 +0100
---
Have you ever seen that you are able to second click on the address bar on website and wondered why there is a menu to add something?
What you will be adding if you press yes is that you are able to have a search engine that pops up in the address bar if you click on it. When you have several search engines added you can hold alt and press the up and down keys to switch what search engine you want to use for the current search. What is also good to know is that you can write something short called a keyword then press `space` or sometimes `tab` and it will select that search engine and then you can enter your term and search with it.

What we will be focusing on today tho is how to add a search engine in many different ways to Firefox and Chrome.

* 
{:toc}

## Basic
There are some basic ways to add a search engine to your browser that is quite easy if you just want to be able to search websites and use them this is some good things to know about how you use search engines in your browser.

### Chrome
Chrome has a quite simple way to add a search engine you you can go into `chrome://settings/searchEngines` and add a website search then fill in some name, some shortcut that you will be using that you write before you press `space` to enter the search engine prompt and finally some string like if you wanted for example add twitter you can add `https://twitter.com/search?q=%s` in the third field.

### Firefox
There are 2 ways to do it in Firefox. The first is if you second click on the address bar on a website and you might see an "add" menu. What is really recommended to to then is going to the menu `about:preferences#search` and add a keyword by clicking in the added search engine and pressing `F2` then writing the keyword you want there in order to quickly access the search engine.

But if that does not exist you can do the following. Go to any search text field like maybe the one on <https://simple.wikipedia.org/wiki/Simple_English_Wikipedia> and second click the internal search bar of the top of the page that says "Search wikipedia" then click "add a keyword for this search" and write something like "simp" or alike there. Now you can go the the address bar and write "simp" then `space` then anything you want to search on simple Wikipedia and search. There is a form of requirement that the input field has to have a form element surrounding it and a submit input. This for example limits so this thing cannot be used on Mastodon or certain other websites but the reason it is made this way is that it prevents having to reload the entire website every time you do a search.

## Advanced
What if you want to implement the actual thing yourself like your own entire search feature for your own social network or huge website with more fancy features. What you can do then is using the OpenSearch standard in order to define your search engine and let the user add your search engine to the menu that pops out on Firefox when the user clicks the address bar. You should read about OpenSearch below and now we will look into how to implement it.  
<https://developer.mozilla.org/en-US/docs/Web/OpenSearch>  
<https://en.wikipedia.org/wiki/OpenSearch>  

For this we need to craft an XML file in order for your browser to be able to use your search engine.
```xml
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/"
    xmlns:moz="http://www.mozilla.org/2006/browser/search/">
    <ShortName>Example</ShortName>
    <Description>Example Search</Description>
    <InputEncoding>UTF-8</InputEncoding>
    <Image width="16" height="16" type="image/x-icon">https://example.com/favicon.ico</Image>
    <Url type="application/x-suggestions+json" method="GET" template="http://example.com/suggest.php?sea={searchTerms}"/>
    <Url type="text/html" template="http://example.com/search.php?sea={searchTerms}"/>
    <moz:SearchForm>http://example.com/search.php</moz:SearchForm>
</OpenSearchDescription>
```
- Replace `Example` with a short name for your search engine
- Replace `Example Search` with a longer name for your search engine
- Replace `https://example.com/favicon.ico` with your favicon link
- Replace `http://example.com/suggest.php?sea={searchTerms}` with your search suggestion link if you made one otherwise delete the whole line but make sure to keep the `{searchTerms}` part there and have the correct parameter pointed at
- Replace `http://example.com/search.php?sea={searchTerms}` with your actual search link and also make sure to have `{searchTerms}` somewhere in it where you want the search terms the user entered to be
- Replace `http://example.com/search.php` with the site a user can enter to do a manual search

Upload it to somewhere on your server where it is accessible by an URL.

```html
<link rel="search" type="application/opensearchdescription+xml" title="example"
        href="http://example.com/opensearch.xml" />
```
- Replace `example` with your website name
- Replace `http://example.com/opensearch.xml` with the link to the xml file you made

Place it in whatever page the user is going to be able to add the search engine from maybe your main page or every html page.

Now the user will be able to add your search engine to the browser and search your website conveniently and quickly.

There are probably fancy ways you can use this as make a certain search engine display search if you do not have your own server side search code too like appending `site:example.com` to each search where example.com is replaced with your website and you can have a something powered search bar on your website.

## Master
What if you want to have your own search suggestions too like have everything the user types while having your search engine selected get sent to the server and them seeing a reply of different pages, posts, terms or such below their address bar as search suggestions. This is quite a fancy feature and can be hard to implement correctly. Below is some example code I made for usage in my CrossPoster that lets me search my own posts very efficiently but it is a rather simple example as there are many more features that could be added
```php
<?php
header('Content-Type: application/x-suggestions+json'); # The suggestions type
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0"); # Do not cache while testing in case of errors
# Get the sea variable from the query string
$sea = filter_input(INPUT_GET, 'sea');
# Make a connection to MySQL using PHP Data Objects
$db = new PDO('mysql:host=localhost;dbname=crossposter', 'pi');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_NUM);
$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
# Example query but replace this with whatever you want to search from
$query = 'SELECT p.content as c FROM posts as p WHERE p.content LIKE ? ORDER BY id DESC LIMIT 5';
# Actually do the query
$d = $db->prepare($query);
$d->execute(["%$sea%"]);
$b = [];
# How large from the start and end of the result we want to have the suggestion
$span = 16;
# Iterate over all the results
foreach ($d->fetchAll() as $e) {
    $a = strip_tags($e[0]); # Strip the tags since my example database stores HTML
    $a = html_entity_decode($a); # Some things as &amp; replaced with & in my database
    #$a = preg_replace('/https?:\/\/[^\t\n\ "\'<>\\\^\{\|\}]+/', '', $a);
    $pos = 0;
    # Match where the word is in the post
    if (preg_match('/' . preg_quote($sea) . '/i', $a, $match, PREG_OFFSET_CAPTURE)) {
        $pos = $match[0][1];
    }
    # Various logic for making the result not too long
    $min = $pos - $span;
    $max = $pos + strlen($sea) + $span * 2;
    if ($min < 0) {
        $max += abs($min);
        $min = 0;
    }
    $a = substr($a, $min, $max); # Get the part of the string that is relevant in the post
    $b[] = $a; # Append to results array
}
# echo the JSON
echo json_encode([$sea, $b]);
```
The code is in PHP and what it does is reply with JSON like the following whenever the user writes anything in the search bar with your engine selected.

```json
[
  "mwee",
  [
    "*Mweeoops violently*",
    "*Mweeoops since I am a yeen deer*",
    "*Mweeoops*",
    "a yeendeer I go mweeeoooop"
  ]
]
```
And if the user clicks on any of them they will be sent to your website and the the clicked on will be automatically searched for.

You might want to read the suggestions draft on how the things should and could be implemented linked below  
<https://github.com/dewitt/opensearch/blob/master/mediawiki/Specifications/OpenSearch/Extensions/Suggestions/1.1/Draft%201.wiki>

Now you do know how to use OpenSearch and how to make an extremely fancy website where the user can find anything very easily and you might use it for a social media site, a wiki or maybe you just want to make an extremely fancy feature for your blog.
