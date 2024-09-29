---
layout: post
title: Webhook generator and mod_rewrite
date: 2024-09-29 19:55
tags:
- webhooks
- apache
- php
---
Sometimes you have a large amount of webhooks you want to receive from many different services so why not make one single handler for all of them and with fancy URLs too.

Normally Apache httpd will have different URL paths go to different paths in a file system but there is a way to change that using a thing called mod_rewrite. What this does is adding regex based handlers using conditions and rules to do various actions such as redirects or to change requests internally.

Here is an example of a rewrite rule that can be used for our webhook example that takes URLs starting with `/hooks/` then splits up the following paths separated by forward slash into two different parameters.

`.htaccess`
```apache
RewriteEngine On
RewriteRule ^hooks/([^/]*)/?([^/]*) webhook.php?channel=$1&key=$2 [QSA,L]
```

Here is an explanation of what the regex does and as you might be able to see it splits it in two optional captures to make sure it still rewrites properly internally.

```
^hooks/                 # URL starts with hooks/
       ([^/]*)          # Capture group 1, zero or more characters not slashes
              /?        # Optional literal slash
                ([^/]*) # Capture group 2 of the same type
```

For a way more detailed explanation of what the regex does character by character and also the rule you can look at this.

```
RewriteEngine On # Make sure mod_rewrite in apache httpd is on
RewriteRule # start a rewrite rule
            ^                       # Starts with
             hooks                  # The string "hooks"
                  /                 # Literal slash
                   (                # Start of group 1
                    [               # Start of class
                     ^              # Negate class
                      /             # Literal slash
                       ]            # End group
                        *           # 0 or more
                         )          # End group 1
                          /         # Literal slash
                           ?        # 0 to 1 times
                            (       # Start group 2
                             [      # Start class
                              ^     # Negative class
                               /    # Literal slash
                                ]   # End class
                                 *  # 0 or more
                                  ) # End group 2

                                                       # Second part of rule that decides destination
                                    webhook.php        # Send the request to webhook.php
                                    ?                  # Start query string
                                     channel=$1        # Assign the first group to channel parameter
                                               &       # Separate parameters
                                                key=$2 # Second parameter to key

                                                       # Last part of rule defining flags
                                                       [QSA, # Query string append
                                                            L] # If rule matches make it be the last
```

Now using this we can make a little example PHP script that sends everything to Redis. This however has one downside that it does not verify anything at all and anyone can send anything through a post request so do not actually use this example.

`webhook.php` example
```php
$channel = filter_input(INPUT_GET, 'channel');
$key     = filter_input(INPUT_GET, 'key');

require "Predis/autoload.php";
$red = new Predis\Client();
$c->publish($channel, file_get_contents('php://input'));
```

The part that says Predis is a PHP library called that that can be installed with a command such as `sudo apt install php-predis` if you run some Linux based on Debian which I do usually on most of my computers.

But as you see there is a second part called key which we are going to use to send a key to verify. What this is going to do is so you can generate a key for each web service to use to they can send their requests to a certain URL for handling.

Lets start by creating a certain file that can contain anything really but as long as it does not get changed later unless you of course want to invalidate all keys.

`.webhooksalt`
```
this is a file containing whatever really as long as nothing is changed as that would break hashes in the future
```

And we can then verify that the file does not contain any accidental invisible characters or multiple extra newlines at the end using the following command.

```bash
cat .webhooksalt | python -c 'import sys; print(ascii(sys.stdin.read()))'
```

This will give an output like

```py
'this is a file containing whatever really as long as nothing is changed as that would break hashes in the future\n'
```

And you might wonder what we are going to do with this and that is a command line tool to generate the URLs

`getwebhookurl.php`
```php
#!/usr/bin/php
<?php

$urlbase = "http://127.0.0.1/hooks";
$saltfile = '.webhooksalt';

$home = getenv('HOME');
chdir($home);

if (!file_exists($saltfile)) {
  echo "Saltfile $saltfile not found\n";
  exit(1);
}

if (count($argv) === 1) {
  echo "Usage: {$argv[0]} channel\n";
  exit(1);
}

$salt = file_get_contents($saltfile);

foreach (array_slice($argv, 1) as $arg) {
  $enc = urlencode($arg);
  $hash = hash('sha256', $arg . $salt);
  echo "$urlbase/$enc/$hash\n";
}
```

Now running this code with the argument `test` will give an output like.

```
http://127.0.0.1/hooks/test/cfd66a08601bcb2abe0e0226a7e032e18f5bfa751d3f5233758d7fe94725f772
```

With the IP address just being there as example but replace that with your own if you use this.

But now that we have a key there we can make a thing that verifies that each send key is correct for each channel acting as a password.

```php
<?php
# Lets do this just in case
ignore_user_abort(true);
# Doing this since convenient when debugging and sending HTML here would not make sense
header('Content-Type: text/plain');

# This will get the 'channel' parameter which is '/hooks/HERE/key'
$channel = filter_input(INPUT_GET, 'channel');
# Same but the key parameter which will be '/hooks/channel/HERE'
$key = filter_input(INPUT_GET, 'key');
# filter_input is guaranteed to be a string and not array

# Read the salt from the file which might be wherever you put it
$salt = file_get_contents("/home/pi/.webhooksalt");
# Do the hash so it can be compared
$hashed = hash('sha256', $channel . $salt);

# Verify the hash
if ($key !== $hashed) {
    # If we have a hash that is not equal then it is unauthorized
    http_response_code(403);
    # Lets echo that why not
    echo "Unauthorized";
    # Also exit to prevent further processing
    exit;
}

# Now that we have the authorization we can start doing something with the data so load Predis
require "Predis/autoload.php";
$red = new Predis\Client();

switch ($channel) {
    case "github":
        # Maybe you want special handling for some hooks
        # An example of this would be places where you have to echo back a parameter on GET requests
        break;
    default:
        # Lets make a standard handler for everything else
        if (in_array($_SERVER["REQUEST_METHOD"], ["PUT", "POST", "PATCH"], true)) {
            # If the type of request is one that might have a body we well grab it then send through Redis
            $red->publish($channel, file_get_contents('php://input'));
        }
}
```

If you do use this code make sure to check for special cases your app might need. Using this you should be able with only minimal modifications be able to install webhooks from multiple services and generate each one with a command. The one downside to this is that if the salt somehow leaks you will have whoever has it be able to send in whatever Redis channel they want so you might have to reset it if this happens. A better implementation would make passwords which it stores and allows revocation if anything is compromised.

PHP can be a quite wonky language at times but you tend to get quite used to it after a while. It is nothing I would recommend to someone who starts out programming even tho that is what I did. Back then PHP4 was quite an extreme mess compared to today's PHP8 that is quite more elegant.

So yeah this is mostly to show what fun things could be done with WebHooks and mod_rewrite and such and I have not written an article here in 91 days as of when this is written but in the future I am going to be more active as I am pretty much done with moving houses and such.
