---
layout: post
title: ArgParse in chat bots
date: 2023-12-20 14:48
tags:
- python
- shell
---
The argparse built in library of Python is a rather interesting one. It has a large amount of features and is quite extensible. It is meant for usage in the commend line but you can override some methods in order for it to be used in other contexts such as chat bots.

If you look at the [source](https://github.com/python/cpython/blob/main/Lib/argparse.py) for argparse you will see that it is implemented using classes and therefore we can override them to not use `sys.exit` or anything like that as it would be very counterproductive to use in a chat bot. Here we made a test suite that you can use for testing the commands we will enter and it will be easy to extend it later to be used in an actual chatbot.

`argtest.py`
```py
import argparse
import shlex

class MyArgumentParser(argparse.ArgumentParser):
    def print_usage(self, ign=None):
        raise ValueError(self.format_usage())
    def print_help(self, ign=None):
        raise ValueError(self.format_help())
    def error(self, msg): # When some parsing error happens
        raise ValueError(msg)
    def exit(self, status=0, msg=""):
        raise ValueError(msg) # Typically when the help is called with -h or --help

a = MyArgumentParser()
a.add_argument("-a") # One specific argument that is called like -a1 -a=s or -a="Something here"
a.add_argument("--b", dest='b', type=int) # Must be an int
a.add_argument("pos", nargs="*") # Takes the rest of the positional arguments

s = a.add_subparsers(dest="command")

f = s.add_parser('fetch', help="a subparser")
f.add_argument('-l', action="store_true")
f.add_argument("a", nargs="*")

g = s.add_parser('get', help="another subparser")
g.add_argument('-e', action="store_true")
g.add_argument("a", nargs="*")

def test(line):
    try:
        # shlex splits the text input just like it was something passed on the command line
        print(a.parse_args(shlex.split(line)))
    except ValueError as e:
        # Normally you should do some special handling of errors
        # in this clause but this is just a test function for demonstration purposes
        print(repr(e))
        print()
        print(e)


# Use like this
test("-a=\"Something here\" --b 1 d a b c  -- -a 1")
```

So lets run a few tests where we will enter some commands into it from strings and let it parse it and see what we will get as results.

```py
# -a="Something here" --b 1 d a b c  -- -a 1
Namespace(a='Something here', b=1, pos=['d', 'a', 'b', 'c', '-a', '1'])
```

As you see we are getting this Namespace object out whre you can access attributes like `object.a` or such. if we instead pass an empty string into the parser you will get an object like this that has all the keys but they are empty. You might want to have some value defined as required for this reason or have a clause that either one or the other of something must be defined for it to work.

```py
Namespace(a=None, b=None, pos=[])
```

If we on the other hand just pass one single quote as input that is a syntax error in `shlex.split` and we do want to use that as a normal split would not handle any shell like syntax properly and not support any argument with a space inside it which we do want.

```py
# '
ValueError('No closing quotation')
```

We can also get help messages which will be formatted nicely by writing `-h` or `--help` which will print something like this.

```
# -h or --help
usage: argtest.py [-h] [-a A] [--b B] [pos ...]

positional arguments:
  pos

optional arguments:
  -h, --help  show this help message and exit
  -a A
  --b B
```

If we have typed arguments they will get validated too as you can see.

```py
ValueError("argument --b: invalid int value: 'a'")
```

We can also define subparsers and chose which command that way

```py
test("fetch -l s 3 33")
Namespace(a=['s', '3', '33'], b=None, pos=[], command='fetch', l=True)

test("get -e testing mew")
Namespace(a=['testing', 'mew'], b=None, pos=[], command='get', e=True)

test("-a 1 --b 2 1 get -e testing mew")
Namespace(a=['testing', 'mew'], b=2, pos=['1'], command='get', e=True)
```

This I plan to use to make some kind of chatbot with many features as it can be a pain to parse bot messages in more manual ways.

Look at [This article](https://ellietheyeen.github.io/2023/12/14/command-line-social-media-poster.html) for an example of how I have parsed command line messages in the past and it is pretty much a direct conversion from a Discord bot.

Anyway this is all I bother to write today as has been quite sick lately but I am starting to feel better
