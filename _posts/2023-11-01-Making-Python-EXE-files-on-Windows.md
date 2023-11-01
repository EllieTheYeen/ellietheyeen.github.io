---
layout: post
date:   2023-11-01 22:57:17 +0200
title:  Making Python EXE files on Windows
---
So sometimes you have certain Windows programs that do not really want to take many arguments and want just a single exe file to point at. A good example of this is protocol handlers or just general command line programs for when you do not use tools like cygwin currently.

A protocol handler is a thing in Windows that when you want to open a certain kind of external protocol on a certain URL or alike. The most obvious example is the http protocol used for websites. There are many more for example for IRC like you might have a protocol handler in register that opens IRC when you enter IRC links starting with irc: in the run menu `win + r` or in the browser and an example of one that runs kvirc is below exported from Regedit
```ini
Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\SOFTWARE\Classes\irc]
@="URL:IRC Protocol"
"URL Protocol"=""

[HKEY_CURRENT_USER\SOFTWARE\Classes\irc\DefaultIcon]
@="C:\\Program Files\\KVIrc\\kvirc.exe,0"

[HKEY_CURRENT_USER\SOFTWARE\Classes\irc\Shell]

[HKEY_CURRENT_USER\SOFTWARE\Classes\irc\Shell\open]
@="Open with KVIrc"

[HKEY_CURRENT_USER\SOFTWARE\Classes\irc\Shell\open\command]
@="C:\\Program Files\\KVIrc\\kvirc.exe --external \"%1\""
```

But you might want to open other things such as a file type instead when you double click on a file or something completely else.  
You might want to have so when you click on magnet links in any program you torrent client should start which is great for when you want to test a few hundred Linux distributions without having to manually download all torrent files.

What I found out when it comes to exes on windows is that there are so many tools to make them but what we are going to focus is the ones that Python is using internally for installations with extra scripts such as the packages you install in that add a command that you can run in the command line.

Such things end up on Linux for example in one of these paths  
`/usr/local/bin/`
`/home/$USER/.local/bin/`  
Of if you have anaconda on Windows it might and up at  
`C:\Users\username\anaconda3\Scripts`

What you need to make these programs are Python's internal packaging tools like setuptools (even tho that is mostly decrepated) or pip

Let's say we have the following files as used in this example project I made for this post: <https://github.com/EllieTheYeen/Mew>
```
mew/__init__.py
mew/__main__.py
.gitignore
README.md
pyproject.toml
setup.py
```
Now we have two different options of how to install these  
Either we can use the `pyproject.toml` that is used in the more modern packaging system you run with `pip install -e .`
```toml
[project]
name = "mew"
readme="README.md"
version = "3.0.0"
description = "Just a small test project"

requires-python = ">=3.8"
dependencies = [
    "requests>=2.25.1",
]

[build-system]
requires = ["setuptools", "wheel"]
build-backend = "setuptools.build_meta"

[project.scripts]
mew = "mew.__main__:main"
```
Or we can use the older setuptools `setup.py` that you run like `python setup.py install`
```python
from setuptools import setup

setup(
    name="mew",
    version="0.0.1",
    requires=[],
    entry_points={"console_scripts": ["mew=mew.__main__"]},
)
```
Lets say we have some code here as `mew/__main__.py` we want to have inside an exe to run
```python
import sys


def fancylist(l):
    return ", ".join(tuple(l[:-2]) + (" and ".join(l[-2:]),))


def main():
    args = sys.argv[1:]
    if len(args) == 0:
        print("*Mews softly*")
    else:
        print(f"*Mews softly at {fancylist(args)}*")


if __name__ == "__main__":
    main()
```
This just mostly is a fun test example that produces console output

After we have assembled things and also placed an empty python file `mew/__init__.py` due to how modules work we can run either `pip install -e .` or `python setup.py` to install the module and if it succeeds you will be able to write `mew` in the command line to run the program and you can of course also run it like a module with `python -m mew`.

## Limitations
The one limitation is that this thing is meant for local things and you cannot really move the exe file around or it might stop working and this includes both between other computers or even locally as it tends to depend on where other binaries are placed like `python.exe`

## Virtualenv
I do really recommend using virtualenv for this when testing as it can be really annoying to take care of misplaced modules in your main python installation.
You can install virtualenv like `pip install virtualenv` then `virtualenv somedirectory` and enter it and source the activate script inside it and test around things without causing problems with your main installation

## What are these exe files?
They are nothing special really inside and you can use tools like strings to see the strings inside them or just open them with Notepad++ and see that it might contain some string where to find Python like   
`#!C:\Users\username\anaconda3\python.exe`  
A charset specifier  
`__main__.py# -*- coding: utf-8 -*-`  
And a small entry point finder looking like this
```python
import re
import sys
from mew.__main__ import main
if __name__ == '__main__':
    sys.argv[0] = re.sub(r'(-script\.pyw|\.exe)?$', '', sys.argv[0])
    sys.exit(main())
```
And also some things such as this but I have no idea what this does but it seems important
```xml
<assembly xmlns="urn:schemas-microsoft-com:asm.v1" manifestVersion="1.0">
  <trustInfo xmlns="urn:schemas-microsoft-com:asm.v3">
    <security>
      <requestedPrivileges>
        <requestedExecutionLevel level="asInvoker" uiAccess="false"></requestedExecutionLevel>
      </requestedPrivileges>
    </security>
  </trustInfo>
</assembly>
```

Anyway good luck in getting Python applications working more smoothly on Windows

*Mweeoops*
