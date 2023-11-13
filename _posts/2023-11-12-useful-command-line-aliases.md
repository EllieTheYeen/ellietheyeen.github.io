---
layout: post
title: Useful command line aliases
date: 2023-11-12 14:27
---
There are quite a bit of useful aliases you can have on your command line in order to do many useful things. Having aliases makes using the shell much easier and if you have any command that is hard to remember or write I really recommend to add it to aliases since then you will have a way easier command line experience. Here are some of the aliases I use on my command line that gets sourced in `~/.bashrc` and `~/.zshrc`

```shell
alias bat='bat -pp --theme="Monokai Extended Origin"'
```
This is [Bat](https://github.com/sharkdp/bat) which together with `alias cat='bat'` a replacement for cat that gives you syntax highlighting

```shell
alias findt='find -mtime 0 -print'
```
This will recurse down directories and list every file that has been changed in the last 24 hours

```shell
alias diff='diff --color'
alias grep='grep --color=auto'
alias ls='ls -rt --color=auto --human-readable'
```
This sets to these tools have color by default using aliases which is really useful and for more colors for these you can install [LS_COLORS](https://github.com/trapd00r/LS_COLORS)

```shell
alias git='git --no-pager'
```
This will turn off the annoying pager for git commands

```shell
alias scanet='nmap 192.168.0.0/24'
```
Scans the local network for hosts and services which is great if you have a large amount of smart home devices you want to find

```shell
alias apt='nice -19 apt'
```
Prevents apt from taking way to much processor when upgrading which can take resources from other programs which can cause them to lag

```shell
alias repr='python -c '\''import sys; print(repr(sys.stdin.read()))'\'
```
A program you can pipe things into to have a representation of binary data which you can easily copy which is similar to `cat -v` but way more readable

```shell
alias args='python -c '\''import sys; print(sys.argv[1:])'\'
```
Good for shell debugging when you want to debug how many arguments something is calling something with and you can make a file of this too for easier usage in other scripts

```shell
alias lcd='cd "$OLDPWD"'
```
Quick command to get back to the directory you just were in

```shell
alias ea='nano ~/.aliases && source ~/.aliases'
```
Open your alias file in nano and when it is closed the aliases are reloaded

```shell
alias ll='ls -latr'
```
Runs ls listing all files as a list with the latest modified file furthest down on the list

```shell
alias ga='git status'
alias gd='git diff'
alias gs='git diff --staged'
alias gl='git log --reverse'
```
Various git aliases that are very convenient when working in git to quickly get the status, diff and log.

```shell
alias ds='python -c "import win32api; win32api.PostMessage(0xFFFF, 0x0112, 0xF170, 2)"'
```
This is to on windows turn off the screens and I have this connected to a button on my streamdeck

```shell
alias tailaf='tail -n0 -f ~/scoop/apps/apache/current/logs/{access,error}.log'
```
Tail both access and error log at the same time starting with no lines displayed. There is also a command called [multitail](https://linux.die.net/man/1/multitail) that can do this in a fancier way

```shell
alias purgeold='sudo apt purge $(dpkg -l | grep ^rc | cut -d" " -f3)'
```
Uninstall old unused packages completely removing the config and data files too and not just the program files

```shell
alias doupgrade='sudo bash -c "apt update && apt full-upgrade -y && apt --purge autoremove -y && apt clean"'
```
Do everything needed for an upgrade with a single command

```shell
alias swe='export LANG="sv_SE.UTF-8"'
alias eng='export LANG="en_US.UTF-8"'
```
Change command line language on the fly which you might want to do for some reason

```shell
alias chmox='chmod +x'
```
Since I keep misspelling chmod +x and if you have some commands you keep misspelling why not add them as aliases

I hope these are useful since I have had a lot of use for them for the many years I have used the command line.

*Mweeoops*
