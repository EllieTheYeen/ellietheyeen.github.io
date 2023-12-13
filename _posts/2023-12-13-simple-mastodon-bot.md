---
layout: post
title: Simple Mastodon Bot (Oriented Objects)
date: 2023-12-13 13:43
tags:
- mastodon
- python
---
A while ago I decided to make a very silly Mastodon bot that generates fake object oriented class names as I had done something similar many years ago as a Facebook bot when I still was there. It takes several things that sounds like it is part of a class and puts together and sometimes makes some funny nonsense. I have it running here if you want to check it out <https://botsin.space/@oo>.

So here is the poster file which uses the mastodon Python library to do a post. Specifying the mastodon version helps that the library does not have to check the version of mastodon every single invocation.

`oopost.py`
```py
import mastodon

import oogen


m = mastodon.Mastodon(
    mastodon_version = '1.4.3',
    api_base_url = 'https://botsin.space',
    access_token =  'some token here',
)

name = oogen.gen()
print(name)

post = m.status_post(name)

print(post.id)
```

This is run by a cronjob every few hours to make a post and the actual generator looks like as following.

`oogen.py`
```py
import random
import os


start = []
middle = []
end = []

cdir = os.path.split(__file__)[0] or '.'

with open(os.path.join(cdir, 'oocomponents.txt')) as f:
    for line in f.readlines():
        line = line.strip()
        if not line: continue
        s = line.split()
        if len(s) != 4: continue
        name, poss, posm, pose = s
        if int(poss): start.append(name)
        if int(posm): middle.append(name)
        if int(pose): end.append(name)

def upperfirst(s: str) -> str:
    if not s: return s
    return s[0].upper() + s[1:]

def gen() -> str:
    a = random.choice(start)
    if random.randint(0, 1):
        m = random.randint(1, 3)
        b = random.sample(middle, m)
    else:
        b = []
    c = random.choice(end)
    return f'{upperfirst(a)}{"".join(upperfirst(g) for g in b)}{upperfirst(c)}'

if __name__ == '__main__':
    while not input():
        print(gen())
```

It is quite simple really even if the code might look a bit messy.

The data file that it imports looks like this and specifies if the part os allowed on beginning, middle and end. The file is over 600 lines long so posting the entire thing here would be silly but it is posted here if you want it <https://gist.github.com/EllieTheYeen/2b3698cf14f81822c85531089d9c5de0>.

Part of `oocomponents.txt`
```
API			1	1	0
DHCP		1	1	0
DOM			1	1	0
IO			1	1	1
MySQL		1	0	0
SOAP		1	1	0
SQL			1	1	0
SSL			1	1	0
UI			1	1	1
XML			1	1	0
XPath		1	1	0
ZWave		1	0	0
abstract	1	0	0
accessible	1	1	0
```

This was a quite fun bot project that generates quite silly things now and then.
