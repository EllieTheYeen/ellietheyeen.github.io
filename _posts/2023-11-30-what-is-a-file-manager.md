---
layout: post
title: What is a file manager?
date: 2023-11-30 00:00
image: /images/xnview.png
tags:
- windows
- basics
- linux
---
Do you know what a file manager is? it is very likely that you do not as it is a thing that is very taken for granted due to them coming preinstalled on almost every system. Nothing (usually) stops you from installing another one if there is one you like better. The main point is what a file manager actually does. It is a program that allows you to browse, copy, move, delete, create and see information about files using some form of interface. It also is used to launch files or launch editors in order to edit files and often also allows you to preview them or at least launch a program that previews them.

You have probably noticed at least once when you got a new Android phone and it was very annoying to browse files suddenly since all the UI changed and it is now way harder to find your files. That is that the file manager changed to another one. You can however just search "file manager" on the play store and find a better one that is not so bulky. I for example found one once that allowed you to share files through http directly from the file manager that I had on my old phone.

In this article however we are going to focus on desktop systems mostly like Windows and Desktop Linux and ones like that. Below you should be able to see a picture of Windows explorer named `explorer.exe` which shows a silly test drawing I made in the preview window and various other files shown like you can see all the folders you are able to browse on the side pane, a top pane that shows some file operations and the main window that shows a few pictures and videos and you can see what kind of files they are due to how they preview with the film like ones being video.

* 
{:toc}

## Windows Explorer
[![
Windows Explorer in dark mode showing a folder with many files and there is a bar to the left that shows various folders through quick access and dropbox and a computer icon each with many folders in them. The main window shows around 16 files with big icons with preview for the images. To the right is a preview of a poorly drawn snake that says mew among other things. There is a top bar too that lets you copy stuff and create folders and such.
](/images/windowsexplorer.png)](/images/windowsexplorer.png)

This is good as a reference point as we need one in order to demonstrate the differences between them and how different graphical user interfaces can be across systems. If you wonder why the file manager is so dark in this picture it is due to Windows 10 in this case has dark mode enabled. A very typical thing that a file manager is also able to do is to be launched from the command line such as `explorer` will launch it and `explorer .` will launch explorer in the current directory as a dot refers to the current directory. Below is an example command how you can launch explorer and make it select a certain file inside the folder.
```cmd
explorer.exe /select,somefile
```

## XnView Classic
[![
Xnview which is in light mode which has a top bar with many icons that are big for such things such as rotating images. It has a big browsing bar to the left that shows the current directory and nearby ones. The main window is split in two where the top is images that are clickable and the lower is a preview of the image which shows a shark anthro hand holding a big pill that says b
](/images/xnview.png)](/images/xnview.png)

There is however quite a few file managers and not just explorer that can be used on Windows. Above we have a picture of Xnview which is both a file manager and a picture viewer with a large amount of features. I used to use this program for many years back on Windows XP as the file manager there was not exactly my favorite.

The picture previewed here might seem absurd but is is a shark girl avatar in a trans themed world where the pill is a HRT pill.

Another note is that compared to Windows Explorer it has a file tree where you can see subdirectories and such and scroll between them unlike in windows explorer where you see that one folder you are in at the moment.

## XnView MP
[![
XnView Mp with white background with a small top bar with some operation icons, a side bar with a tree of files, bottom left pans has info about the file like location, dates, histogram button, exiftool button, middle bottom pane has a bunch of categories where you can place an image in, bottom right pane is a preview one. Main pane has large icons that are previews of pictures and the folders have previews of the pictures inside of them and text files like python files have the Python logo on them
](/images/xnviewmp.png)](/images/xnviewmp.png)

XnView also came out with a new version called XnView MP and started to call the old one classic. As you can see the UI feels even more cluttered but that is probably configurable. They do however seem to have the issue of not being able to use dark mode which is a huge downside.

## Midnight Commander
[![
Midnight commander which is command line and is showing two different sides which is browser the folder with white text for most things such as folders and blue for some like favicon.ico and grey for some other files. The top says left, file, command, options and right. The bottom bar says things like help, menu, view, edit, copy, renmov, mkdir, pulldwn and quit and has a line you can enter commands in and a text that says: Hint: Tab changes your current panel.
](/images/midnightcommander.png)](/images/midnightcommander.png)

Here is Midnight Commander which is a really interesting one. It is essentially an open source clone of the old [Norton Commander](https://en.wikipedia.org/wiki/Norton_Commander) and for Linux instead of DOS. I remember back in the day I used Norton Commander and I used it to transfer files between computers through the parallel port which is a feature it had. As you see it is a command line application that is navigated mostly through the keyboard even tho mouse can be used if you have something like Putty. You have a bunch of keys like F1 to F10 to do various operations, you swap between tabs with the tab button and navigate with the arrow keys.

## Ytree
[![
Ytree which is A very simple file manager with blue background on command line showing just a few things like a file browser and a small window showing what files are in the selected directory. A pane to the right shows some disk statistics like current size of disk and directory.
](/images/ytree.png)](/images/ytree.png)

Here is an even more simple one called Ytree which does not have much features at all. You just press enter to navigate between upper folder view, lower folder view and inner folder view. It has a bunch of commands for things such as hex edit just like Midnight commander but you cannot do much else in it.

## Caja
[![
Caja which is a simple file manager with white background showing a pane to the left that says computer and network and under that shows a few directories like music, downloads, desktop, pictures, trash and File system. The top pane shows a basic navigation with back and forward buttons and there is also a section where you can go down and up directories and see where you are and a button for each subdirectory and above directory. The main window had a small bar that says: 21 items, free space: 7.2 GB. The main window has icons where there is a note for music and a camera for pictures and such and the files also have icons like a picture of a paper for each and there are a bunch of txt and sh files with that icon
](/images/caja.png)](/images/caja.png)

Here is Caja which is a good example of one of the file managers that can come preinstalled on Linux such as an Ubuntu version or something similar that is graphic. It has some good features like being able to connect to Windows file sharing servers. As Linux does not inherently have any file manager this is something that the distributer installers in a distribution.

## pcmanfb-qt
[![
pcmanfm-qt which is mostly identical to Caja but more simplistic and has white background like there are just a few icons on left pane like desktop, trash, computer and applications, the top bare is minimalistic too with a few things like back and forward button and one button for each directory you are in. The main pane has icons like a previewed picture and the txt and similar files are seen as a pic of a paper icon and the shell files are seen as a black paper with a hashbang icon on it
](/images/pcmanfm-qt.png)](/images/pcmanfm-qt.png)

Here is pcmanfb-qt which came preinstalled in Ubuntu and it is quite simple looking but does what it is supposed to do.

## Nautilus
[![
Nautilus which is an even more simplistic file manager with white background and the top bar that just has back and forward buttons and a bar that says home and a few more buttons, the left pane says stuff like documents, trash, downloads, videos, starred, recent and other locations with matching icons. The main pane has very large icons that looks like folders and papers and the pictures folder looks like a camera, music like a note and downloads like a downwards arrow
](/images/nautilus.png)](/images/nautilus.png)

Nautilus here looks very simplistic and I have not heard much about it except for the [nautilus-dropbox](https://github.com/dropbox/nautilus-dropbox) extension for it that I do not think I have tried.

## Thoughts
A file manager is an essential part of every operating system. You can install which ones fits you best. There are probably way more fancy ones out there with way more features. The ones listed here is either freeware like xnview or open source like the others except Windows Explorer of course. When it comes to programs like this there can generally be a large amount of improvements that come in the future when it comes to GUI development. Some really fancy applications come with a built in file browser that has most of the features of a file manager too.

Which file manager do you use and why?
