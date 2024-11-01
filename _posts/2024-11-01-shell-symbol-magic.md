---
layout: post
title: Shell symbol magic
date: 2024-11-01 20:48
tags:
- shell
- bash
- zsh
---
Shell languages like bash have some interesting syntax that looks like magic as it is just symbols in the syntax and not a single word actually written. This makes writing these things extremely hard to remember or write but once you know them you can do quite some useful things using shells.

* 
{:toc}

## Setting up for testing

We are going to focus on Bash for this as there is `dash`, `zsh` and a bunch of others but what is inside bash is very similar to zsh and works almost identical except a few quirks. Most of these symbol related syntaxes are called expansions or substitutions.

To begin let's define some variables to use to test these where one is a string, second one a simple array and third is resetting the shell input often called ARGV and is the arguments passed to the current script or function.
```sh
var='this is a variable with lowercase and UPPERCASE'
arr=('after ' ' before' ' surrounded ' 'alone')
set 'one ' ' two ' 'three'
```
Also we need to define how to actually display the output which we will do with this where lines starting with `$ ` are commands being run.
```sh
$ printf %q\\n several "arguments here" to test ' this '
several
arguments\ here
to
test
\ this\
```
As it prints one thing per line escaped we can see what is actually shaped by these symbols. Now on to what ones there are.

## Symbolry
Let's get started with the magic symbols.

### "$@" each command line argument as separate argumemnt
```sh
$ printf %q\\n "$@"
one\
\ two\
three
```
Good for getting all shell arguments to pass elsewhere.

### $* or $@ all shell args
```sh
$ printf %q\\n $*
one
two
three
$ set ' a ' 'b ' ' c d '
a
b
c
d
```
This does same as above but takes away spaces.

### "$*" all shell args into one
```sh
$ printf %q\\n "$*"
one\ \ \ two\ \ three
```
Yes this packs everything into a single argument.

### $@ "$@" each shell arg into separate argument
```sh
$ printf %q\\n "$@"
one\
\ two\
three
```

### ${#var} length of string
```sh
$ printf %q\\n "${#var}"
47
```
Yes the length.

### ${#arr[@]} length of an array
```sh
$ printf %q\\n "${#arr[@]}"
4
```
Yep the length.

### "${arr[@]}" all members of array with each element as an argument
```sh
printf %q\\n "${arr[@]}"
after\
\ before
\ surrounded\
alone
```

### "${arr[@]}" all members of array with each element as an argument but losing spaces
```sh
$ printf %q\\n ${arr[@]}
after
before
surrounded
alone
```

### "${arr[*]}" all members of array joined by space into a single argument
```sh
$ printf %q\\n "${arr[*]}"
after\ \ \ before\ \ surrounded\ \ alone
```
Good for joining arrays.

### ${arr[*]} , "${arr[@]}" or ${arr[@]} all members of array but cut members up
```sh
$ printf %q\\n ${arr[*]}
after\
\ before
\ surrounded\
alone
$ printf %q\\n ${arr[@]}
after\
\ before
\ surrounded\
alone
$ printf %q\\n "${arr[@]}"
after\
\ before
\ surrounded\
alone
```

### ${arr[@]:start} or ${arr[@]:start:length} slice an array
```sh
$ printf %q\\n "${arr[@]:2}"
\ surrounded\
alone
$ printf %q\\n "${arr[@]:2:1}"
\ surrounded\
$ printf %q\\n ${arr[@]:1:1}
\ before
$ printf %q\\n ${arr[@]:3}
alone
```

### ${var#string} cut off beginning
```sh
$ printf %q\\n ${var#}
this\ is\ a\ variable\ with\ lowercase\ and\ UPPERCASE
$ printf %q\\n ${var#var}
this\ is\ a\ variable\ with\ lowercase\ and\ UPPERCASE
$ printf %q\\n ${var#*var}
iable\ with\ lowercase\ and\ UPPERCASE
$ printf %q\\n ${var#this}
\ is\ a\ variable\ with\ lowercase\ and\ UPPERCASE
$ printf %q\\n ${var#}
this\ is\ a\ variable\ with\ lowercase\ and\ UPPERCASE
$ printf %q\\n ${var#*var}
iable\ with\ lowercase\ and\ UPPERCASE
```
Quite convenient substring like feature.

### ${var%string} cut off end
```sh
$ printf %q\\n ${var%and*}
this\ is\ a\ variable\ with\ lowercase\
$ printf %q\\n ${var%with*}
this\ is\ a\ variable\
$ printf %q\\n ${var%CASE}
this\ is\ a\ variable\ with\ lowercase\ and\ UPPER
$ printf %q\\n ${var%low*}
this\ is\ a\ variable\ with\
$ printf %q\\n ${var% *}
this\ is\ a\ variable\ with\ lowercase\ and
```
Quite useful but might be hard to figure out

### ${var-default} get value of variable or return default if empty
```sh
$ printf %q\\n ${var-default}
this\ is\ a\ variable\ with\ lowercase\ and\ UPPERCASE
$ printf %q\\n ${nonexistent-default}
default
```
Good when a variable might not be set.

### ${var:=default} get value of variable or set default if empty
```sh
printf %q\\n ${var:=default value}
this\ is\ a\ variable\ with\ lowercase\ and\ UPPERCASE
$ printf %q\\n ${varr:=default value}
default\ value
$ printf %q\\n ${varr}
default\ value
```
Similar to Python's `dict.setdefault`.

### ${var:start} or ${var:start:length} substring
```sh
$ printf %q\\n ${var:10}
variable\ with\ lowercase\ and\ UPPERCASE
$ printf %q\\n ${var:10:6}
variab
$ printf %q\\n ${var:1:10}
his\ is\ a\ v
```
Fully functional substring with a length argument that is better than those that want you to specify the end.

### ${var^^} uppercase string
```sh
$ printf %q\\n ${var^^}
THIS\ IS\ A\ VARIABLE\ WITH\ LOWERCASE\ AND\ UPPERCASE
```
VERY!

### ${var,,} lowercase string
```sh
$ printf %q\\n ${var,,}
this\ is\ a\ variable\ with\ lowercase\ and\ uppercase
```
no uppercase anymore.

### $(( )) do math
```sh
$ printf %q\\n $(( 42 - 69 + 2 + 1337 ))
1312
```
Precisely what it says.

### ${var[@]@A}
```sh
$ echo ${var@A}
var='this is a variable with lowercase and UPPERCASE'
$ echo ${arr[@]@A}
declare -a arr=([0]="after " [1]=" before" [2]=" surrounded " [3]="alone")
```
Notice the echo here but also yes this gives the array definition or string definition needed to properly export the variable

### ${var[@]@Q}
```sh
$ echo ${var@Q}
'this is a variable with lowercase and UPPERCASE'
$ echo ${arr[*]@Q}
'after ' ' before' ' surrounded ' 'alone'
$ echo ${arr[@]@Q}
'after ' ' before' ' surrounded ' 'alone'
```
This quotes stuff.

### ~- ~+ ~ $PWD $OLDPWD $HOME
```sh
$ printf %q\\n ~- ~+ ~ $PWD $OLDPWD $HOME
/home
/home/pi
/home/pi
/home/pi
/home
/home/pi
```

## End
This shows that shells do indeed have quite some features that can be used for quite a few tasks and while many of these tricks do not work in zsh it has its own magic.
