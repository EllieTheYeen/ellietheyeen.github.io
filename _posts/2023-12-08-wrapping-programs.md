---
layout: post
title: Wrapping Programs
date: 2023-12-08 23:32
tags:
- python
- shell
- c
---
Sometimes it is important to make programs that wrap other programs for example in order to get the exit status, standard output and standard error. Examples of is game server wrappers, various error handlers and loggers. If you start tasks using systemd they will be wrapped automatically and you will be able to get the status and output and such and even install an error handler which we talked about [here](https://ellietheyeen.github.io/2023/11/19/discord-systemd-error-handler.html). You might also want to make your own wrapper if you want to do something more complex like having game server chat bridges and such.

* 
{:toc}

## Whole output
When my [bots](https://ellietheyeen.github.io/bots.html) post they typically use this to monitor and log errors and to log the ids of posts. This is a good way to know if a bot fails as the error message can then be sent as a notification to know that it failed. It wraps both stderr and out and logs the error code if any in case there are any strange exits. The downside of this is that it reads the entire output from the program and buffers it and waits for it to end which if there is some very long runtime with several errors you will not know it until the end.

`botpost.py`
```py
#!/usr/bin/python
import subprocess as sp
import datetime
import os


def init():
    global bots
    os.nice(10 - os.nice(0))
    bots = dict()
    cur = os.path.abspath(os.path.split(__file__)[0])
    dow = os.path.join(cur, '..')
    os.chdir(dow)
    with open(os.path.join(cur, 'posters.txt')) as f:
        for a in f.readlines():
            s = a.strip().split(' ', 1)
            if len(s) == 1: continue
            bots[s[0]] = s[1]

def command(commandline, shell=False):
    a = sp.Popen(commandline, stdout=sp.PIPE, stderr=sp.PIPE, shell=shell)
    return (a.wait(),) + tuple(b.strip() for b in a.communicate())

def add_date(a):
    n = str(datetime.datetime.now())
    return '\n'.join('%s %s' % (n, b) for b in a.strip().split('\n'))

def log(f, t):
    with open(f, 'a') as f:
        f.write(add_date(t) + '\n')

def post(bot, hidden=False):
    if not bot in bots:
        return 'Error: bot %s not found' % bot
    botcommand = bots[bot]
    cod, out, err = command(botcommand, shell=True)
    out = out.decode('utf-8')
    err = err.decode('utf-8')

    if cod:
        err = f'Exit code: {cod}\n{err}'

    try:
        import redis
        r = redis.Redis()
    except: pass

    if out or err:
        try:
            os.mkdir('log')
        except: pass

    if out:
        try:
            log('log/%s.log' % bot, out)
        except: pass
        outmsg = bot + '\n' + out #'\n'.join('%s %s' % (bot, o) for o in out.split('\n'))
        try:
            #if hidden:
            #    r.publish('boterrorlocal', outmsg)
            #if not hidden:
            outmsgr = bot + ' ' + out
            r.publish('botoutputlocal', outmsgr)
        except: pass
    if err:
        try:
            log('log/%s_error.log' % bot, err)
        except: pass
        errmsg = bot + '\n' + err #'\n'.join('%s %s' % (bot, o) for o in err.split('\n'))
        try:
            if hidden:
                r.publish('boterrorlocal', errmsg)
            else:
                r.publish('boterror', errmsg)
        except: pass
    return out, err

if __name__ == '__main__':
    import sys
    init()
    out, err = post(sys.argv[1] if len(sys.argv) > 1 else 'test', 'hidden' in sys.argv[2:])
    if out:
        print('OUTPUT:', out)
    if err:
        print('ERROR:', err)
    if not out and not err:
        print('No output or error for some reason')
```

## Line by line
It is also possible to read the output line by line which is a bit more complex as you either need a few threads in order to do it or non blocking IO but in this example threads are used. As its threaded nature it also needs a lock when printing as there can be race conditions with garbled output if two threads print a line at the same time. Python normally does not flush the output after each line so this program sets the `PYTHONUNBUFFERED` environment variable to `1` in order to get all the output line by line as the lines appear.

You can try the buffering using  
```sh
PYTHONUNBUFFERED=1 python -c 'import time;[(print(a), time.sleep(1)) for a in range(5)]' | cat
```
and see how it acts if you unset or set the environment variable and how the code below does not need it  
```sh
python -c 'import time;[(print(a,flush=True), time.sleep(1)) for a in range(5)]' | cat
```

But we set that environment variable in case it is not set in a script as setting the buffering in other ways is harder. The wait call is what gets the exit code of the program. There are also several mechanisms to prevent lag and spam such as the bot no hammer that avoids doing stuff on the minute and the code that unsets the streams on end as it tends to read empty strings extremely fast for some reason if you read from a closed stream.

`botpostnew.py`
```py
#!/usr/bin/python
import subprocess as sp
import traceback
import threading
import datetime
import time
import sys
import os

import redis


def readthread(proc, stream, channel, name):
    def inner():
        sub = '' if stream == 'stdout' else '_error'
        try:
            outfp = open(f'log/{name}{sub}.log', 'a')
        except:
            traceback.print_exception()
        while proc.returncode is None and (fp := getattr(proc, stream)):
            line = fp.readline().decode('utf-8').rstrip('\r\n')
            if not line: continue
            with printlock:
                print(stream, repr(line))
            try:
                now = datetime.datetime.now()
                outfp.write(f'{now} {line}\n')
            except: pass
            try:
                red.publish(channel, f'{name} {line}')
            except: pass
            time.sleep(0)
    return inner

def command(commandline, name):
    proc = sp.Popen(commandline, stdout=sp.PIPE, stderr=sp.PIPE)
    try:
        for args in (('stdout', 'botoutputlocal'), ('stderr', 'boterror')):
            rt = threading.Thread(target=readthread(proc, *args, name))
            rt.daemon = True
            rt.start()
        return proc.wait()
    finally:
        proc.stderr = None
        proc.stdout = None

printlock = threading.Lock()

try:
    red = redis.Redis()
except:
    traceback.print_exception()
    red = None

os.nice(10 - os.nice(0))
bots = dict()
cur = os.path.abspath(os.path.split(__file__)[0])
os.chdir(cur)
dow = os.path.join(cur, '..')
os.chdir(dow)
with open(os.path.join(cur, 'posters.txt')) as f:
    for a in f.readlines():
        s = a.strip().split(' ', 1)
        if len(s) == 1: continue
        bots[s[0]] = s[1]

bot = sys.argv[1] if len(sys.argv) > 1 else 'test'

if not bot in bots:
    exit(f'Error: bot {bot} not found')

try:
    os.mkdir('log')
except: pass

if os.environ.get('BOTPOST_NOHAMMER'):
    import random
    import time
    secs = random.randint(5, 55)
    print(f'Waiting {secs} secs to avoid hammering')
    time.sleep(secs)

os.environ['PYTHONUNBUFFERED'] = '1' # Makes Python automatically output without having to call flush

cmd = bots[bot]
exitcode = command([cmd], bot)
print(exitcode)
if exitcode:
    with open(f'log/{bot}_error.log', 'a') as f:
        now = datetime.datetime.now()
        f.write(f'{now} Exit code: {exitcode}\n')
```

## Complicated wrapper example
This is an example of the code that was used when we hosted a Terraria server to bridge the chat to Discord. A bit more code was used for this but it shows what can be done as an example. Most game dedicated servers can be wrapped this way and there are even some special wrappers that allow remote restart in case of crash.

`wrap.py`
```py
#!/usr/bin/python
import subprocess as sp
import threading
import sys

import redis


def readthread(channel):
    while hasattr(process, 'std' + channel):
        o = getattr(process, 'std' + channel).readline().strip() #.replace('\x00', '')
        if not o: continue
        #while o.startswith(': '): o = o[2:] # Terraria
        with ol:
            #print channel.upper(), repr(o)
            ro.publish(prefix + channel, o)
    with ol:
        ro.publish(prefix + 'status', '%s closed' % channel)

def outthread():
    readthread('out')

def errthread():
    readthread('err')

def inthread():
    ps.subscribe(prefix + 'in')
    for m in ps.listen():
        if m['type'] == 'message':
            with il:
                process.stdin.write(m['data'] + '\n')


if len(sys.argv) < 3:
    print >> sys.stderr, 'Usage: wrap.py channelprefix command'
    exit(1)

prefix = sys.argv[1] + '.'

ol = threading.Lock()
il = threading.Lock()

process = sp.Popen(sys.argv[2:], stdin=sp.PIPE, stdout=sp.PIPE, stderr=sp.PIPE, shell=True)

print 'Started with pid %s' % process.pid

ro = redis.Redis()
ro.publish(prefix + 'status', 'Started %s' % process.pid)

ri = redis.Redis()
ps = ri.pubsub()

ts = outthread, errthread, inthread
for tf in ts:
    t = threading.Thread(target=tf)
    t.daemon = True
    t.start()

exitcode = process.wait()

ro.publish(prefix + 'status', 'Stopped %s %s' % (process.pid, exitcode))
```

## C example
If you wonder how it is implemented on the C level here is an example that is very commented and you can see which syscalls are used. Take note of the dup2 call especially as it is the thing that redirects the streams to pipes. This is also just an example as there are many things you would do differently in production related to error handling and such.

`wraptest.c`
```c
#include <stddef.h>
#include <stdlib.h>
#include <unistd.h>

int main() {
  int outpipe[2], errpipe[2]; // Create the variables to hold file descriptors

  pipe(outpipe); // Create the pipe for usage for the wrapped process output to the wrapper
  pipe(errpipe); // The same but with error stream which is useful if there is an error

  if (fork() == 0) { // Child that will later exec the wrapped process
    close(outpipe[0]); // Close this since it will not be used as this is unidirectional
    close(errpipe[0]); // The same but there could be a possibility to use these for stdin
    dup2(outpipe[1], 1); // The wrapped process will now have its output redirected to the wrapper
    dup2(errpipe[1], 2); // The same but with error stream
    execl("test.sh", "test.sh", NULL); // Run the process to be wrapped
    exit(1); // Exit since the wrapped process could not be started
  } else { // Parent or the wrapper proces
    close(outpipe[1]); // Closing this side of the pipe since unidirectional
    close(errpipe[1]); // Same but with error instead of output
    char buf[1024]; // Allocate a buffer for the data
    ssize_t rd = read(outpipe[0], buf, 1024); // Read from output into buffer and store read amount in rd
    write(1, "out ", 4); // Print the string "out " so we know this is the output
    write(1, buf, rd); // Print the read output data from buffer
    rd = read(errpipe[0], buf, 1024); // Read error stream
    write(1, "err ", 4); // Print "err " for the same reason
    write(1, buf, rd); // Print the error stream
  }
}
```

Here is an example of the test script it runs if you want to try it

`test.sh`
```sh
#!/bin/bash
echo 1
echo 2 >/dev/stderr
```

And what it outputs throw the wrapper

`output.txt`
```txt
out 1
err 2
```

This guide is mostly for Linux as Windows wrapping is slightly different but should work generally the same but with different system calls
