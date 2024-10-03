---
layout: post
title: Command Not Found
date: 2024-10-03 19:37
tags:
- shell
---
Have you ever wondered what specifically happens when a command is not found on bash or zsh. Some you get some kind of message about installation. Here is how it works.

At first we need to know specifically what happens and that is that bash will search for a function called `command_not_found_handle` and zsh similarly searches for a function called `command_not_found_handler`. Certain packages might install a handler for these for example the `command-not-found` on debian that you can install using `sudo apt install command-not-found`.

We are going to look how that package sets up its handlers and where everything is defined. We can start by looking at the main system bashrc.

Part of `/etc/bash.bashrc`
```bash
# if the command-not-found package is installed, use it
if [ -x /usr/lib/command-not-found -o -x /usr/share/command-not-found/command-not-found ]; then
        function command_not_found_handle {
                # check because c-n-f could've been removed in the meantime
                if [ -x /usr/lib/command-not-found ]; then
                   /usr/lib/command-not-found -- "$1"
                   return $?
                elif [ -x /usr/share/command-not-found/command-not-found ]; then
                   /usr/share/command-not-found/command-not-found -- "$1"
                   return $?
                else
                   printf "%s: command not found\n" "$1" >&2
                   return 127
                fi
        }
fi
```

As you can see it searches for a certain executable if the command is not found and zsh does the same shown below.

Part of `~/.zshrc`
```zsh
# enable command-not-found if installed
if [ -f /etc/zsh_command_not_found ]; then
    . /etc/zsh_command_not_found
fi
```

This might get copied from for example `/etc/zsh/newuser.zshrc.recommended` which gets copied to each user that runs `zsh` the first time and it will source the script below that is part of that package.

`/etc/zsh_command_not_found`
```zsh
# (c) Zygmunt Krynicki 2007,
# Licensed under GPL, see COPYING for the whole text
#
# This script will look-up command in the database and suggest
# installation of packages available from the repository

if [[ -x /usr/lib/command-not-found ]] ; then
        if (( ! ${+functions[command_not_found_handler]} )) ; then
                function command_not_found_handler {
                        [[ -x /usr/lib/command-not-found ]] || return 1
                        /usr/lib/command-not-found -- ${1+"$1"} && :
                }
        fi
fi
```

If you wonder what it does it will show a message like

```sh
Command 'sdf' not found, but can be installed with:
sudo apt install sdf
```

But it can be made to do more if you define the following environment variable

```sh
export COMMAND_NOT_FOUND_INSTALL_PROMPT=1
```

If this is defined it will do something else which is

```sh
Command 'sdf' not found, but can be installed with:
sudo apt install sdf
Do you want to install it? (N/y)
```

And as you can see it suggests if you want to install it and pressing `y` then enter will install the package that the command belongs to if it finds it. In Kali Linux for example that environment variable is defined in `/etc/environment` so it gets set in all session but you can set it yourself in `~/.bashrc` or wherever your shell gets sourced from.

If you wonder more about this package you can see what apt show shows about it.

```yaml
# apt show command-not-found
Package: command-not-found
Version: 23.04.0-1
Priority: optional
Section: admin
Maintainer: Julian Andres Klode <jak@debian.org>
Installed-Size: 535 kB
Depends: apt-file (>= 3.0~exp1~), lsb-release, python3-apt, python3:any
Suggests: snapd
Tag: implemented-in::python, interface::shell, role::program, scope::utility
Download-Size: 55.2 kB
APT-Manual-Installed: yes
APT-Sources: http://deb.debian.org/debian bookworm/main arm64 Packages
Description: Suggest installation of packages in interactive bash sessions
 This package will install a handler for command_not_found that looks up
 programs not currently installed but available from the repositories.
```

The rest of it is a lot of Python code which would take a long time for me to explain but you can look in for example 
<https://kali.download/kali/pool/main/c/command-not-found/> and download `command-not-found_23.04.0.orig.tar.xz` and open it in 7zip if you want to see what is in it as it is not downloadable from PIP.

However this is not the only implementation as there is <https://github.com/metti/command-not-found> which is for archlinux and seems to be written in C++.

If you want to define your own command not found handler you can do it like the following to make it function in both bash and zsh

```sh
command_not_found_handle ()
{
  echo "$1 is a command that does not seem to be there"
  return 127
}

command_not_found_handler()
{
  command_not_found_handle "$1"
  return $?
}
```

But you can put really whatever you want to be returned if the command is not found that you find fun or useful.
