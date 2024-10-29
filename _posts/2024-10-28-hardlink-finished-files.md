---
layout: post
title: Hardlink finished files in aria2
date: 2024-10-28 14:21
tags:
- aria2
- shell
- linux
---
So I recently started to use the [aria2](https://aria2.github.io/) download manager since my NAS is starting to really break down at this point but there is one single feature it lacks. That feature is to be able to move finished files into a different directory. With torrents this tends to be somewhat hard to do since they have a seeding phase after the download phase and only the application itself is allowed to move the files during that phase as otherwise it cannot upload them to other users.

* 
{:toc}

## About links

To solve this there was several things to consider. One thing was that if I moved the files that would be an issue since seeding. If I copied the files there was another issue of them taking up double the amount of space. However there is a third and even a fourth option. The third option is to make a symbolic link that acts just like that file in almost every single case except one where the files are moved or copied by a tool that is aware of those being links and then fail to copy the actual files. Therefore we are using a fourth option which is called a hard link.

A hard link is a very nifty feature where a file can exist in many places at once similarly to a value inside a programming language that is garbage collected. Similarly if all hard links to a file is removed the file is essentially gone from the file system and might be overwritten. Due to how this works if you create another link to the same file it will not take up all that files space and instead it just takes up a few bytes extra.

To create any form of link on a Linux system we will use the `ln` command which stands for link. The ln command has a bunch of flags like `-f` to forefully place a file destroying the previous file at target if necessary and `-s` which makes links symbolic. To use the command the first argument should be the path to the target source file which the newly created link should lead to and the second argument is where that link should be placed. The links can be relative paths or absolute but make sure you are specifying the correct path as of when the link is used as compared to when the link is created or just use absolute paths.

## aria2

Back to what we need to do with aria for this. Let's go to the home directory and make sure the directory `.aria2` exists and inside it there should be a file called `aria2.conf` which you shoulc create if not existing.

`/home/yeen/.aria2/aria2.conf`
```ini
on-bt-download-complete=/home/yeen/.aria2/done.sh
on-download-complete=/home/yeen/.aria2/done.sh
dir=/home/yeen/Downloads/aria/unfinished
```
As you see my username is yeen but change it to what yours is. Also notice `done.sh` which we are also going to create which you can do with any text editor really but make sure you do `chmod +x done.sh` to make sure it is executable and here is the contents of it.

`/home/yeen/.aria2/done.sh`
```bash
#!/bin/bash
cd "$(dirname "$0")"

uid="$1"
code="$2"
file="$3"

srcdir='/home/yeen/Downloads/aria/unfinished/'
dstdir='/home/yeen/Downloads/aria/finished/'

# If file does not start with srcdir which
#  would mean it is not inside the correct folder then exit
if [[ "$file" != "$srcdir"* ]]; then
    exit 1
fi
# If $file is not a file then exit
if [[ ! -f "$file" ]]; then
    exit 1
fi
# Get the relative path by subtracting the absolute directory path
rel="${file#$srcdir}"
echo $rel
# Get if the file is inside any kind of subdirectory then create it
dname="$(dirname "$rel")"
if [[ "$dname" != '.' ]]; then
    mkdir -p "$dstdir$dname"
fi
# Hardlink since there is no s flag the file to the dest dir in the subdir if there
ln "$file" "$dstdir$rel"
```

There is quite a bunch of things inside here but all of it is to do the following steps.
0. Change directory to the directory of the script just in case
1. Get the variables from input arguments
2. Define the source dir and destination paths as absolute paths ending with slash
3. Check to make sure the input file is inside the source directory or exit
4. Check that the file actually exists and is an actual file or exit
5. Calculate the relative path of the file from the absolute path for later usage using a bash expression.
6. Check if the resulting relative path is inside any form of subdirectory
7. If inside any form of subdirectory create that inside the destination path
8. Make a hardlink to the file

So yeah that is not that complex and ln gets the arguments as absolute paths. Now there is just one step left that is to create a systemd unit to run the whole thing and let's do a user unit for that. An easy way to create the unit is to run the command
```bash
systemctl --user edit --full --force aria
```
which will open nano or whatever editor you have chosen but if you have not selected an editor run `select-editor` first. Now for the contents to paste in

`/home/yeen/.config/systemd/user/aria.service`
```ini
[Unit]
Description=Aria2 download manager

[Service]
ExecStart=/bin/aria2c --enable-rpc --rpc-listen-all --rpc-secret YourPasswordHerePleaseChange
WorkingDirectory=/home/yeen/Downloads/aria/unfinished

[Install]
WantedBy=default.target
```
and save and exit.

Before you run it make sure all the paths are existing that you want to use for the downloads or else things might not work but you can run the following command to create all those directories
```bash
mkdir -p ~/.aria2/ ~/Downloads/aria2/{finished,unfinished}
```

Now you can start aria2 in RPC mode using this and it will run on every start and be ready for any downloads you add. Just run
```bash
systemctl --user enable --now aria
```
and it will start up now and be enabled on the next upstart.

## More
There are a few more things that I recommend and one of them is to install [webui-aria2](https://github.com/ziahamza/webui-aria2) to be able to control aria since otherwise you will just have a JSON-RPC API to access it through.

Personally I use that and I also use my own browser extension which gives me a menu on every page to start a download which I might write about next.

Now if you get everything working you can just look at your finished files directory now and then and see whenever a file is downloaded and finished and start using it even tho the whole torrent that is downloading is not fully finished yet or see every other file too as soon as it is downloaded without it taking extra hard drive space as soon as it finished.

[Part 2](/2024/10/29/downloader-browser-extension.html)
