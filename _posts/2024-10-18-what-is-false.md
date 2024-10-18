---
layout: post
title: What is false?
date: 2024-10-18 21:55
tags:
- javascript
- python
- java
- perl
- php
---
An interesting thing in programming languages is what is actually considered false when comparing it as a boolean such as inside an if clause. Each language has their own way of comparing what is false where some have bizarre rules and some have very simple ones. Certain languages eve have rules where some types are considered false sometimes.

* 
{:toc}

## Java
Known falsehoods: `false`, `Boolean(false)`

Java has the most simple rule that only a boolean may ever be considered considered for truth or falsehood and that is either the simple `boolean` primitive true or the object `Boolean()` that is. Be careful that you do not dereference a null pointer as a variable that is set as the type Boolean can contain one unlike the primitive.

## Python
Known falsehoods: `False`, `None`, `""`, `b""`, `0`, `0.0`, `()`, `{}`, `[]`, `set()`

Python has way more complex rules when it comes to what is `True` and `False` and yes they must be capitalized in order to work. Empty strings are considered false and also empty bytestrings `bytes` are also considered false. Numbers like the `int` `0` is considered false and the `float` `0` is also considered false and similarly with the complex `0j` and so on.

What is unusual with Python here is that any type can chose if it is True or False at any time using the `__bool__` method that is called whenever there is a comparison so `()` `tuple`s `set()` `set`s `[]` `list`s and `{} dict`s are considered false if empty.

If you define your own type you can do like this
```py
class A:
    def __bool__(self):
        return False

print(bool(A()))
```
And it will print `False` in this example as that is what the type compares to.

## Perl
Known falsehoods: `0`, `"0"`, `""`, `undef`

Perl has some sort of consistent rules except one single bizarre quirk when it comes to that a string containing exactly a single `0` zero character will evaluate to false. However in Perl there is not a real boolean type in all versions. I am very new to this language so there might be a lot more quirks like these are the types are not acting like I am used to

## PHP
Known falsehoods: `false`, `null`, `0`, `0.0`, `""`, `"0"`, `[]`

Just like Perl the string containing exactly one zero is false so you should probably compare against what you really want to compare against which you should do in code anyway.

Keep in mind that there is also the special function `isset` that does a different kind of truth check compared to `boolval` in that everything that is not `null` or `false` is considered true.

`isset` also has the functionality that you can use `isset($array["nonexistentkey"])` without getting any warnings or errors so you do not have to use `in_array("nonexistentkey", $array, true)` for example.

There is "supposed" to be boolean overloading for classes in PHP but that is [a whole other absurdity](https://stackoverflow.com/questions/6113387/how-to-create-a-php-class-which-can-be-casted-to-boolean-be-truthy-or-falsy).

## JavaScript
Known falsehoods: `false`, `undefined`, `0`, `""`

JavaScript has simpler rules than you would expect from such a wonky language but just like PHP it has extremely wonky rules for comparison that I might write about another time.

To cast to boolean in PHP you can use `!!something` or `Boolean(something)` but you are not supposed to use `new Boolean(something)` [for some reason](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean).

Anyway it is good to know how to really check if something is really false in programming before you assume that something is considered in when compared.
