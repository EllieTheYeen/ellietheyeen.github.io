---
layout: post
title: Systemd sockets
date: 2024-10-11 22:07
tags:
- systemd
- sockets
- python
- shell
---
You might have heard about [inetd](https://en.wikipedia.org/wiki/Inetd) which is often called a [super-server](https://en.wikipedia.org/wiki/Super-server) according to Wikipedia. But did you know the systemd can do the same thing using something called [systemd sockets](https://www.freedesktop.org/software/systemd/man/latest/systemd.socket.html). I will show you how to use them.

* 
{:toc}

At first we are going to start with how to actually set them up and how they work. 

The first thing to do is to create the socket unit which looks like this

`testsocket.socket`
```ini
[Unit]
Description=Test socket

[Socket]
ListenStream=1024
Accept=yes

[Install]
WantedBy=default.target
```

To create a unit you can use the command
```sh
systemctl --user edit --full --force testsocket.socket # For user unit
sudo systemctl edit --full --force testsocket.socket # For system unit
```
Which will open up an editor like `nano` but if you have not selected an editor I recommend using nano which you can set using
```sh
select-editor
```

Except this unit you also need to define a second unit that is a service

`testsocket@.service`
```ini
[Unit]
Description=Test socket service

[Service]
ExecStart=/home/yeen/blep.sh
```

And do note that there is an @ in the name just like in the [Failure handler](https://ellietheyeen.github.io/2023/11/19/discord-systemd-error-handler.html) guide from a while ago.

Not to take a look what the started script actually does using `lsof -p $$` inside the script. As you can probably see a socket is open in file descriptor 3 and I have no idea what the pipe in 4 is but that does not matter much.

```sh
COMMAND  PID USER   FD   TYPE             DEVICE SIZE/OFF     NODE NAME
blep.sh 9877 yeen  cwd    DIR                8,2     4096 50298626 /home/yeen
blep.sh 9877 yeen  rtd    DIR                8,2     4096        2 /
blep.sh 9877 yeen  txt    REG                8,2   125688   262951 /usr/bin/dash
blep.sh 9877 yeen  mem    REG                8,2  2220400   263025 /usr/lib/x86_64-linux-gnu/libc.so.6
blep.sh 9877 yeen  mem    REG                8,2   240936   263020 /usr/lib/x86_64-linux-gnu/ld-linux-x86-64.so.2
blep.sh 9877 yeen    0r   CHR                1,3      0t0        5 /dev/null
blep.sh 9877 yeen    1u  unix 0x0000000000000000      0t0   120353 type=STREAM
blep.sh 9877 yeen    2u  unix 0x0000000000000000      0t0   120353 type=STREAM
blep.sh 9877 yeen    3u  IPv6             121878      0t0      TCP localhost:1024->localhost:42958 (ESTABLISHED)
blep.sh 9877 yeen    4r  FIFO               0,13      0t0   117586 pipe
blep.sh 9877 yeen   10r   REG                8,2       81 50333753 /home/yeen/blep.sh
```

The script itself used to test it is here

``blep.sh`
```sh
#!/bin/sh
a="$(lsof -p $$)"
echo "$a" > ~/sdfdfg.txt
echo "$a" >&3
env > env.txt
```

What the `>&3` does is tell it to write to file descriptor 3 so the lsof output from above is emitted from netcat connecting to the systemd socket.

The reason for `env` to be there is that some variables set there might be very useful and we can take a look at them here filtered from what usually exists in the env vars of systemd units being run.

```diff
12,13c12,13
< INVOCATION_ID=2106c6f489634605b77ec4c53b18e6ad
< JOURNAL_STREAM=8:139232
---
> INVOCATION_ID=10f97a5493074bf8b914b8bbbcd421c2
> JOURNAL_STREAM=8:120353
23a24,26
> LISTEN_FDNAMES=connection
> LISTEN_FDS=1
> LISTEN_PID=9877
29a33,34
> REMOTE_ADDR=127.0.0.1
> REMOTE_PORT=42958
32c37
< SHLVL=1
---
> SHLVL=0
34c39
< SYSTEMD_EXEC_PID=11197
---
> SYSTEMD_EXEC_PID=9877
36c41
< _=/usr/bin/env
---
> _=/usr/bin/dbus-update-activation-environment
```

As you see there are some things to take note of like `REMOTE_ADDR=127.0.0.1` and `REMOTE_PORT=42958` which were from a run where I just ran `nc localhost 1024` which is netcat.

If you wonder how to get this diff do something like

```
systemd-run --user bash -c 'env > enva.txt'
diff <(sort enva.txt) <(sort env.txt)
```
And you will get a good diff.

Now we can test with python too by making a script in it that receives the invocation.

`blep.py`
```py
#!/usr/bin/python3
import socket
s = socket.fromfd(3, socket.AF_INET, socket.SOCK_STREAM, proto=0)
s.send(b"Blep I am cat meow\n")
s.close()
```
And as you can guess it will send `Blep I am cat meow` to anyone who connects to the socket.

One last note is that you might have to use a command like
```sh
systemctl --user status testsocket@\*
```
and scroll a bit up and down to find the status as it creates a temporary service for every invocation that you can find in the logs.

Anyway now you know the basics of systemd sockets so you can have fun with them.

## Added later

### 2024-10-11 23:30
So apparently you can set stdin and stdout to be used to write to the socket. Here is an example. Start by changing your
`testsocket@.service`
```ini
[Unit]
Description=Test socket

[Service]
ExecStart=/home/yeen/blep.sh
StandardInput=socket
StandardOutput=socket
StandardError=journal
```
It is possible to set all 3 to socket but you should generally set the error one specifically to journal since otherwise it will write stderr to the socket too instead of into the journal.

Now we can update the
`blep.sh`
```sh
#!/bin/sh
lsof -p $$
echo log something here >&2
```
And now you can log things while also using stdout to write to the socket.

It is also very useful to start another terminal and use the following command to follow everything that happens in the log.
```sh
journalctl --user -f
```
