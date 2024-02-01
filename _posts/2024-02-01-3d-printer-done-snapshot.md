---
layout: post
title: Get notifications when 3D prints are done in OctoPrint
date: 2024-02-01 20:49
tags:
- photography
- 3dprinting
- octoprint
- python
- shell
---

When you have 3D prints in OctoPrint it is convenient to know when a print is done and how it looks. Since Octoprint already tends to be set up with a webcam or other camera in mind this is quite easy to set up.

To get this to work we must first make sure to add some lines to the config that runs some scripts whenever certain events happen in OctoPrint. We need to add a few lines to the OctoPrint config.ym.

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

What this does it it will run a command whenever those events happen and we can send those to a shell script that is below that will handle them. If you use these remember that you should change the paths like the username and such and comment away things that you do not have on your system. The shell script below should be in the scripts folder of the .octoprint folder or where octoprint is.

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

This is of course my own config so you do not need to take note of anything but the donesnapshot.py which is below

```py
#!/usr/bin/python3
from collections import OrderedDict as odict
from contextlib import closing
from urllib.request import urlopen
from urllib.parse import urlencode
import math
import time
import sys
import os

from octconfig import config


def ts(seconds, periods=None, weeks=False):
    if periods is None:
        periods = dict(day=86400, hour=3600, minute=60)
    if weeks:
        periods.update(dict(week=604800))
    p = sorted(periods.items(), key=lambda x: -x[1])
    s = ''
    for name, period in p:
        if seconds >= period:
            intervals = int(math.floor(seconds / period))
            seconds = seconds - (intervals * period)
            if len(s) > 0:
                if seconds:
                    s += ", "
                else:
                    s += " and "
            s += str(intervals)
            s += " %s" % name if intervals == 1 else " %ss" % name
    if seconds >= 1 or len(s) == 0:
        if len(s) > 0:
            if not seconds:
                s += ", "
            else:
                s += " and "
        s += str(seconds)
        s += " second" if seconds == 1 else " seconds"
    return s

def tss(seconds, periods=None, weeks=False, spaces=False):
    if periods is None:
        periods = dict(d=86400, h=3600, m=60)
    if weeks:
        periods.update(dict(w=604800))
    p = sorted(periods.items(), key=lambda x: -x[1])
    s = ''
    for name, period in p:
        if seconds >= period:
            intervals = int(math.floor(seconds / period))
            seconds = seconds - (intervals * period)
            if spaces and len(s) > 0: s += ' '
            s += str(intervals)
            s += name
    if seconds >= 1 or len(s) == 0:
        if spaces and len(s) > 0: s += ' '
        s += str(seconds)
        s += "s"
    return s


event = sys.argv[1]
args = odict(tuple(a.split('=', 1)) for a in sys.argv[2:])

gcodenoending = args['name'].rsplit('.')[0]
timeseconds = int(float(args['time']))

try:
    with closing(urlopen(config['snapurl'], timeout=60)) as f:
        imgdata = f.read()
except Exception as e:
    print(e)
    imgdata = None

filename = '{time}_{duration}_{gcode}.jpg'.format(
    time=time.strftime('%Y-%m-%d_%H-%M-%S'),
    gcode=gcodenoending,
    duration=tss(timeseconds),
    )

try:
  os.mkdir(config['imagepathdone'])
except: pass

if imgdata is not None:
    with open(os.path.join(config['imagepathdone'], filename), 'wb') as f:
        f.write(imgdata)

import requests

s = '{printerid} {gcode} in {time}'.format(printerid=config['printerid'], gcode=gcodenoending, time=ts(timeseconds))

hok = "" # Place a Discord webhook URL in here

if hok:
    a = requests.post(hok, data=dict(content=s), files=dict(file=(filename, imgdata)), timeout=10)
    print(a.text)
```

You might notice it imports a config file for things and here is the config file which you should use and replace the snap url with your camera URL.

```py
config = dict(
        printerid     = 1,
        snapurl       = 'http://192.168.0.22:8081/?action=snapshot',
        imagepathdone = '/home/klong/.octoprint1/doneimages',
        imagepathfail = '/home/klong/.octoprint1/failimages',
        imagepathsave = '/home/klong/.octoprint1/savedimages',
        )

```

Now if you have set up everything correctly a picture will be taken whenever a print is done and the picture will be sent to a Discord channel using webhooks.
