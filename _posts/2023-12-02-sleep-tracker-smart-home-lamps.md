---
layout: post
title: Sleep tracker with smart home lamp control
date: 2023-12-02
tags:
- smarthome
- telldus
- python
- shell
- iot
---
So I recently decided to fix up my command line sleep tracker since it is a thing I have wanted to fix for a while. The specific issue is that I specifically have to find the enter key to press when I wake up to turn on the lights. The whole tracker works that you run it and all the lamps turn off then it waits for a key press and when a key is pressed it turns the lamps on again and tell how long time you slept for.

The reason it specifically had to be the enter key is that Python has a function called `input` that reads whatever characters you press and returns when you press enter. This is however now the only way you can do in a terminal as you can read character by character too but that requires changing the terminal mode as it usually waits for lines.

This should be a good example of what you can do using smart home devices. When it does come to Internet of Things and Smart Home devices I would really recommend making your own devices or at least buy things that support quite open protocols since otherwise you run into the issue of a product line getting discontinued and the product having to be thrown away unless you are really good at hacking as open source hardware is rare. This is all due to capitalism which is quite unfortunate but DIY and open source hardware is the best solution for this.

* 
{:toc}

## Example of reading one character
Below is an example of that can be done with it first saving the normal terminal mode, sets the special mode, reads one character and finally restores the terminal mode to the normal line based one.

`readone` python
```python
#!/usr/bin/python3
import termios
import tty
import sys

past = termios.tcgetattr(0)
try:
    tty.setcbreak(0)
    a = sys.stdin.read(1)
finally:
    termios.tcsetattr(0, termios.TCSANOW, past)

print(a)
```

## Time measuring and display (stime)
Here is the actual code it is used in. It is a Python program that just logs the time, waits for input and then prints the time passed until the key is pressed and formats the time with a very readable format for display and logging. The reason why the finally clause existing is that if the user presses control c it would exit the whole thing without restoring the state which would cause the terminal to end up in a strange state that could only be solved with `stty sane` in the terminal or restarting the terminal.

`stime` python
```py
#!/usr/bin/python3
import subprocess
import time
import math
import sys


def tsm(seconds, periods=None, weeks=False, milliseconds=True):
    if periods is None:
        periods = dict(day=86400, hour=3600, minute=60)
    if weeks:
        periods.update(dict(week=604800))
    millis = 0
    if milliseconds:
        millis = int(round((seconds - int(seconds)) * 1000))
        seconds = int(math.floor(seconds))
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
    if seconds >= 1 or (len(s) == 0 and not millis):
        if len(s) > 0:
            if not seconds:
                s += ", "
            else:
                s += " and "
        s += str(seconds)
        s += " second" if seconds == 1 else " seconds"
    if millis:
        if len(s) > 0:
                if millis:
                    s += " and "
                else:
                    s += ", "
        s += '%s milliseconds' % millis
    return s

start = time.time()
if len(sys.argv) < 2:
    import termios, tty
    past = termios.tcgetattr(0)
    try:
        tty.setcbreak(0)
        sys.stdin.read(1)
    finally:
        termios.tcsetattr(0, termios.TCSANOW, past)
else:
    subprocess.Popen(sys.argv[1:], shell=True).communicate()
stop = time.time()
print(tsm(stop - start))
```

You probably see the `tty.setcbreak` function which is what is used here to set the mode and how there is start and stop variables for time logging and comparison. There is a whole function for formatting the time too that you can take a look at or use if you want.

## Actual good night script (goodnight)
Now we can look at the actual good night script that I have aliased to `gn` and run whenever I go to bed.

`goodnight` zsh
```zsh
#!/bin/zsh
{
echo 0 $(date);
echo "Don't forget medicines" >&2;
clpubl toirc Sleep. Remember to dream 2>&1 >/dev/null
lic 0 K1 K4 >&2;
} | tee -a ~/.cron/log/goodnight.log

s=$(stime);

{
echo 2 "$s"
echo 1 $(date);
lic 1 K1 K4 >&2
clpubl toirc Wakeup after "$s". Remember the dreams 2>&1 >/dev/null
} | tee -a ~/.cron/log/goodnight.log
```

`clpubl` is just a shell script that sends data to redis on another host
`lic` stands for "light control" and it turns Telldus lamps off by name and is a simple script I made

## Publish to Redis thingy for IRC (clpubl)
So I am mostly presenting this as I had quite some issues reading parameters of input in zsh and in shell in general. The syntax is quite strange and it took quite some time to figure it out. If you wonders what it actually sends to it is [IOTReact IRC](https://github.com/EllieTheYeen/IOTReact/tree/main/addons/irc) which is a project I made and use locally for some smart home things and to have a local IRC server for notifications.

`clpubl` zsh
```py
#!/bin/zsh
a=(${@:2})
curl \
 --silent \
 -d '[REDACTED]=[REDACTED]' \
 --data-urlencode "top=$1" \
 --data-urlencode "msg=${a[*]}" \
 'http://[REDACTED]/[REDACTED].php'
```

There might be better solutions but I do not have a keyboard on the pi that has the IRC thing and such so I set up it this way.

# Light control program (lic)
Here is the actual command line program to control Telldus devices which is used for the whole thing. It might look very messy since it was many years since I wrote it maybe over 8 years ago or more. You can list what devices you have, turn them on and off and a bunch of other things with it.

`lic` python
```py
#!/usr/bin/python3
import urllib
import json
import sys
import os

from oauthlib import oauth1


def oauthrequest(path, params=dict()):
    url = 'http://api.telldus.com/json' + (path if path.startswith('/') else '/' + path) + ('' if '?' in path else '?' + urllib.parse.urlencode(params))
    q = urllib.request.Request(url)
    for header, value in oauth.sign(url)[1].items():
        q.add_header(header, value)
    u = urllib.request.urlopen(q)
    try:
        return json.loads(u.read())
    finally:
        u.close()

def oauthrequests(path, params=dict()):
    url = 'http://api.telldus.com/json' + (path if path.startswith('/') else '/' + path)
    u = requests.get(url, params=params)
    return u.json()

def convertresponse(b):
    s = {}
    for d in b['device']:
        s[d['id']] = d['name']
    return s

def deviceinfo(idn):
    return oauthrequest('device/info', params=dict(id=idn))

def onoff(idn, state):
    return oauthrequest('device/turn' + ('On' if state else 'Off'), params=dict(id=idn))

def bell(idn):
    return oauthrequest('device/bell', params=dict(id=idn))

def dim(idn, percentage):
    percentage = (percentage if percentage >= 0 else 0) if percentage <= 100 else 100
    value = int(percentage * 2.555)
    return oauthrequest('device/dim', params=dict(id=idn, level=value))

def nbell(name):
    dev = getdevice(d)
    if dev is None:
        return 'Device %s not found' % dev
    return bell(dev)

def nonoff(name, state):
    dev = getdevice(name)
    if dev is None:
        return 'Device %s not found' % dev
    return onoff(dev, bool(state))

def ndim(name, percent):
    dev = getdevice(d)
    if dev is None:
        return 'Device %s not found' % dev
    return dim(dev, percent)

def getdevices():
    return oauthrequest('devices/list', params=dict(supportedMethods=4095))

def listdevices():
    return convertresponse(getdevices())

def getdimpercent(idn):
    try:
        response = deviceinfo(idn)
        return int(float(response['statevalue']) / 2.55)
    except Exception as e:
        print(e)
        return 0

def tryint(a):
    try:
        return int(a)
    except: pass

def loaddevices():
    global devicelist
    with open(os.path.expanduser('~/.lic/devices.json')) as f:
        devicelist = json.load(f)
    return devicelist

def getdevice(a):
    d = tryint(a)
    if d is not None:
        return d
    if not devicelist:
        loaddevices()
    for key, val in devicelist.items():
        if val == a:
            return key

devicelist = {}

oauth = oauth1.Client('[REDACTED]', '[REDACTED]', '[REDACTED]', '[REDACTED]')

if __name__ == '__main__':
    if len(sys.argv) < 2:
        exit('One argument required')
    elif sys.argv[1] in ('list', 'l'):
        for idn, device in loaddevices().items():
            print(idn, device)
    elif sys.argv[1] in ('update', 'u'):
        devicelist = listdevices()
        try:
            os.mkdir(os.path.expanduser('~/.lic/'))
        except:
            pass
        with open(os.path.expanduser('~/.lic/devices.json'), 'w') as f:
            json.dump(devicelist, f, indent=1)
            f.write('\n')
        print('Updated')
    elif sys.argv[1] in ('on', 'y', '1'):
        if len(sys.argv) < 3:
            exit('One device required')
        for d in sys.argv[2:]:
            print(nonoff(d, 1))
    elif sys.argv[1] in ('off', 'n', '0'):
        if len(sys.argv) < 3:
            exit('One device required')
        for d in sys.argv[2:]:
            print(nonoff(d, 0))
    elif sys.argv[1] in ('dim', 'd'):
        if len(sys.argv) < 3:
            exit('Dim setting required')
        if len(sys.argv) < 4:
            exit('One device required')
        level = int(sys.argv[2])
        for d in sys.argv[3:]:
            print(ndim(d, level))
    elif sys.argv[1] in ('bell', 'b'):
        if len(sys.argv) < 3:
            exit('One device required')
        for d in sys.argv[2:]:
            print(nbell(d))

```

## Usefulness of this sleep tracker
You might wonder about the usefulness about this and it is extremely useful both to track your sleep and to be able to turn off the lights in an easy way. In the past I used to have a remote to do it but nowadays I just use this with the added feature of being able to press any button. The last addition to this I made is to add the thing that publishes on IRC when I went to sleep and how long I slept since otherwise I had to read the log file. Now I can just log in to weechat or any other IRC client from any of my phones or computers and see the time.

If I wanted to go really advanced with this I would add so the wakeup can be triggered externally from something like IRC or web and also to list how long I have slept so far to know if I should sleep more.

Feel free to use any of the code here if you find it useful if you want to have your own sleep tracker
