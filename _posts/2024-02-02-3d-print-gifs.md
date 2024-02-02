---
layout: post
title: 3D print GIFs using OctoPrint
date: 2024-02-02 03:22
tags:
- photography
- 3dprinting
- octoprint
- python
- shell
---

OctoPrint has a feature to automatically make videos using a webcam and mjpg streamer or any other camera that can take snapshots by getting some data from an URL. This can be convenient but sometimes you want things that are sized differently or maybe a GIF instead of a video. 

This is good for many reasons such as usage on social media as GIFs tend to be short and videos tend to be long and if there is no audio anyway then a GIF is perfect. You should read [this article](https://ellietheyeen.github.io/2024/02/01/3d-printer-done-snapshot.html) as it describes certain things you will need to set this up properly.

We start with the actual GIF making program that uses FFMPEG to make the GIF itself, limits it to max 50 frames and also shifts the last frame to be the first so a preview of the GIF shows the object done instead of an empty print bed as it would otherwise.

`makevisibleandsmallgifs.py`
```py
import tempfile
import atexit
import pipes
import sys
import os

import numpy


maxi = 50
dirs = '/home/klong/.octoprint1', '/home/klong/.octoprint2', '/home/klong/.octoprint3'
outdir = '/home/klong/gifmaker/gifs'

tmpdir = tempfile.mkdtemp('.')
atexit.register(os.rmdir, tmpdir)


def makegif(jobpath):
    if not os.path.isdir(jobpath): return False
    job = os.path.split(jobpath)[1]
    outfile = os.path.join(outdir, job + '.gif')
    if os.path.exists(outfile): return False
    alljpgs = os.listdir(jobpath)
    imgamm = len(alljpgs)
    if imgamm < 2: return False
    print(imgamm, jobpath)
    alljpgs = list(filter(lambda x: x.endswith('.jpg'), alljpgs))
    alljpgs.sort(key=lambda x: int(x[:-4]))
    if imgamm > maxi:
        numbers = sorted(set(numpy.linspace(0, imgamm - 1, maxi, dtype=int)))
    else:
        numbers = list(range(len(alljpgs)))
    numbers.insert(0, numbers.pop())

    timed = os.stat(os.path.join(jobpath, alljpgs[0])).st_mtime

    for i, num in enumerate(numbers):
        os.symlink(os.path.join(jobpath, alljpgs[num]), os.path.join(tmpdir, '%s.jpg' % i))

    s = 'ffmpeg -f image2 -i %s/%%d.jpg -framerate 10 -vf scale=640:480 -y %s' % (tmpdir, outfile)
    print(s)
    os.system(s)

    for num in range(len(numbers)):
        os.unlink(os.path.join(tmpdir, '%s.jpg' % num))

    if os.path.isfile(outfile):
        os.utime(outfile, (timed, timed))
    else:
        return False

    return True

if len(sys.argv) > 1:
    i = int(sys.argv[1])
    savedpath = os.path.join(dirs[i - 1], 'savedimages')
    for job in os.listdir(savedpath):
        result = makegif(os.path.join(savedpath, job))
        if result:
            pass # Do something here if you want to
else:
    for instance in dirs:
        savedpath = os.path.join(instance, 'savedimages')
        for job in os.listdir(savedpath):
            makegif(os.path.join(savedpath, job))
```

In the [previous article](https://ellietheyeen.github.io/2024/02/01/3d-printer-done-snapshot.html) there was 2 smaller things shown which was

Part of `config.yml`
```yml
events:
  enabled: true
    - command: /home/klong/.octoprint1/scripts/octoeventhandler CaptureDone file='{file}'
    event: CaptureDone
    type: system
  - command: /home/klong/.octoprint1/scripts/octoeventhandler PrintDone name='{name}'
      path='{path}' origin='{origin}' time='{time}'
    event: PrintDone
    type: system
```

and

`octoeventhandler`
```sh
#!/bin/sh
cd $(dirname "$0")
python sendevent.py "$@" &
#echo $(date +'%Y-%m-%d_%H:%M:%S') "$@" >> ../special.log
case "$1" in
  CaptureDone)
    python copytimelapsefile.py "$@" 2>> error.log &
  ;;
  PrintDone)
    python donesnapshot.py "$@" 2>> error.log &
    python /home/klong/gifmaker/makevisibleandsmallgifs.py 1 &
  ;;
esac
```

where you can see what is being called when. There is also another script that makes sure to save pictures taken for the OctoPrint timelapse which is here

```py
#!/usr/bin/python
from collections import OrderedDict as odict
import shutil
import sys
import os

from octconfig import config


args = odict(tuple(a.split('=', 1)) for a in sys.argv[2:])

savedirectory = os.path.expanduser(config['imagepathsave'])

try:
    os.mkdir(savedirectory)
except: pass

sourcepath = args['file']

filename = os.path.split(sourcepath)[1]
newfoldername, newfilename = filename.rsplit('-', 1)
newfolderpath = os.path.join(savedirectory, newfoldername)
try:
    os.mkdir(newfolderpath)
except: pass
newfilepath = os.path.join(newfolderpath, newfilename)
shutil.copyfile(sourcepath, newfilepath)
```

and now you should have everything that is needed and you can see an example of a GIF made by this below that is automatically generated after every print.

[![A 3D print being printed as a GIF](/images/CFFFP_Drawer_System_20240202001803.gif)](/images/CFFFP_Drawer_System_20240202001803.gif)
