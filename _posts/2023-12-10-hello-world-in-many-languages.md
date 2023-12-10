---
layout: post
title: Hello World In Many Languages
date: 2023-12-10 23:27
tags:
- shell
---
Hello world is the most basic program that you tend to try out in a programming language. Here we are going to look at several languages and how to do hello world in them.

Python is quite simple that it just has a print function you can run and print what yo want to print. The signature of the print function is `print(*args, sep=' ', end='\n', flush=False)` so you can specify if to flush the stream and what separator and what to end each print with. Started with `python hello.py`

`hello.py`
```py
print("Hello world")
```

Ruby is very similar that it has a puts function you call and Ruby has a specialty that you can call functions without having to use parentheses. Started with `ruby hello.rb`

`hello.rb`
```rb
puts "Hello world"
```

Yes you can in fact run java like this and run with `java hello.java` even you tend to compile it with `javac`

`hello.java`
```java
class hello {
 public static void main(String[] args) {
  System.out.println("Hello world");
 }
}
```

Erlang is a quite unusual language that you use recursion instead of iteration and it tends to be compiled too but you can run this with `escript hello.erl`

`hello.erl`
```erlang
main(_) ->
  io:format("~s~n", ["Hello world"]).
```

NodeJS allows you to run JavaScript on the command line and you can start it with `nodejs hello.js`

`hello.js`
```js
console.log("Hello world")
```

Julia is a rather interesting language and you run this with `julia hello.jl`

`hello.jl`
```julia
println("Hello world");
```

Perl since why not and run with `perl hello.pl`

`hello.pl`
```pl
print "Hello world\n"
```

PHP requires the start tag in order to run the thing and you run it with `php hello.php`

`hello.php`
```php
<?php
echo "Hello world\n";
```

The script to run all hello world programs is `./runall.sh`

`runall.sh`
```sh
#!/usr/bin/zsh
echo -e '\e[31;1mErlang\e[39m'
time escript hello.erl
echo -e '\e[31;1mJulia\e[39m'
time julia hello.jl
echo -e '\e[31;1mJavaScript\e[39m'
time nodejs hello.js
echo -e '\e[31;1mPerl\e[39m'
time perl hello.pl
echo -e '\e[31;1mPython\e[39m'
time python hello.py
echo -e '\e[31;1mRuby\e[39m'
time ruby hello.rb
echo -e '\e[31;1mPHP\e[39m'
time php hello.php
echo -e '\e[31;1mJava\e[39m'
time java hello.java
```

Which gives the output ans as you see Java is a bit slow when not compiled

`output`
```sh
Erlang
Hello world
escript hello.erl  0.29s user 0.16s system 137% cpu 0.331 total
Julia
Hello world
julia hello.jl  0.30s user 0.23s system 102% cpu 0.516 total
JavaScript
Hello world
nodejs hello.js  0.50s user 0.05s system 100% cpu 0.547 total
Perl
Hello world
perl hello.pl  0.00s user 0.01s system 93% cpu 0.007 total
Python
Hello world
python hello.py  0.05s user 0.01s system 96% cpu 0.063 total
Ruby
Hello world
ruby hello.rb  0.20s user 0.05s system 99% cpu 0.248 total
PHP
Hello world
php hello.php  0.01s user 0.04s system 98% cpu 0.049 total
Java
Hello world
java hello.java  2.03s user 0.19s system 117% cpu 1.887 total
```
