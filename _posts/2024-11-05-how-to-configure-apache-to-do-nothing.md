---
layout: post
title: How to configure Apache to do nothing
date: 2024-11-05 22:32
tags:
- apache
---
Sometimes you want to configure Apache to really do nothing. No server scripts and just use it as a purely static file server. An example of this would be when you have a Downloads folder and you want to share without there being issues due to how Apache functions.

The first thing we are going to do is make sure `mod_header` is enabled which can be done with the command
```sh
sudo a2enmod headers
```
and after that is done and the config is changed you should restart Apache with
```sh
sudo systemctl restart apache2
```
and we are ready for what config to be set.

Now we have the config which you should put in some file that Apache includes for example I have mine in `/etc/apache2/sites-enabled/000-default.conf` but you can put yours anywhere really. There are quite a few quirks in general we must defeat in order for Apache to just serve files as is without executing any of them by accident. This is the actual config I use to share some downloads between computers that as you can see very commented and explained.

```apache
<Directory /var/www/html/aria/finished>
	# Various fixes
	# Make sure everything is granted by default
	#  as certain file types might be limited by other config
	<FilesMatch ".*">
		Require all granted
	</FilesMatch>
	# .htaccess should not be read
	AllowOverride None
	# No symlinks here as they might lead to odd things unless you want them here ofc
	Options -FollowSymLinks
	Options -SymLinksIfOwnerMatch
	# Turn off the feature of trying to correct faulty filenames to similar ones
	Options -MultiViews

	# Executable code
	# No cgi scripts should be executed here
	Options -ExecCGI
	# Disable server side includes .shtml
	Options -Includes
	Options -IncludesNOEXEC
	# Turn off php in this directory in a way that no .htaccess can turn them on again
	<IfModule mod_php.c>
		php_admin_flag engine off
	</IfModule>

	# Directory listings
	Options +Indexes
	# Good options for directory listing
	IndexOptions +FancyIndexing +IgnoreCase +ShowForbidden
	# Descending Date is good as the newest files 
	#  will be in the top so you do not have to scroll
	IndexOrderDefault Descending Date
	# the README.html should not be automatically be read and shown as part of the listing
	ReadmeName /
	# The same but the HEADER.html that appears on top
	HeaderName /
	# Prevent index.html or similar from displaying and hiding the directory listing
	DirectoryIndex disabled

	# Content-Type
	# Prevent text/html as that can run code we do not want to
	# Many browsers will assume text/html if no Content-Type is found so we need to be explicit
	# If there is no Content-Type header set to text/plain for viewing rather than download
	Header set Content-Type "text/plain" "expr=-z %{CONTENT_TYPE}"
	# If it is not a directory since those always end with slash
	<FilesMatch "[^/]$"> 
		# Set Content-Type to text/plain if it is set to text/html
		# This means that only directory listings can output html
		Header set Content-Type "text/plain" "expr=%{CONTENT_TYPE} =~ m|text/html|"
	</FilesMatch>
</Directory>
# So there is a certain problem where IndexIgnoreReset does not work in a Directory
#  section therefore defining a Location section instead is needed.
# If you wonder why there just cannot be a single Location section it is
# that FilesMatch and LocationMatch sections are forbidden inside Directory sections.
<Location "/aria/finished">
	# Reset the index ignore so everything gets listed
	IndexIgnoreReset ON
	# Set the ignore to an impossible file to not ignore anything
	IndexIgnore /
</Location>
```

Now we have finally defeated the web server and it will no longer do anything unexpected or strange hopefully.
