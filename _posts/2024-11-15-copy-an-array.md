---
layout: post
title: How to copy an array
date: 2024-11-15 16:40
tags:
- javascript
- python
- erlang
- java
- php
- c
---
Copying arrays is something that seems like a very obvious thing in programming but different languages do it in completely different ways.

* 
{:toc}

## Java
Java has the basic array type which is just any type suffixed with `[]` to make it an array. To copy an array like it you use the static method `arraycopy` from the `System` class.

```java
class Main {
    public static void main(String[] args) {
        byte[] a = {1, 2, 3, 4, 5, 6, 7, 8, 9, 0};
        byte[] b = new byte[10];
        System.arraycopy(a, 0, b, 0, 10);
        a[9] = 10; // Change something to make sure we are printing the original values
        for (byte c: b) {
            System.out.print(c);
            System.out.print(" ");
        }
        System.out.println();
    }
}
```
Output:
```
1 2 3 4 5 6 7 8 9 0 
```
But keep in mind that such an array is not like a java primitive so it gets passed as is into functions without it being copied at any stage like a primitive type would.

```java
class Main {
    public static byte[] dosomething(byte[] a) {
        return a;
    }
    public static void main(String[] args) {
        byte[] a = {1, 2, 3, 4, 5, 6, 7, 8, 9, 0};
        byte[] b = dosomething(a);
        b[9] = 10;
        for (byte c: b) {
         System.out.print(c);
         System.out.print(" ");
        }
        System.out.println();
    }
}
```
Output
```
1 2 3 4 5 6 7 8 9 10
```

Java also has classes like `ArrayList` which is a dynamic array and to copy one you use the `clone` method.
```java
class Main {
    public static void main(String[] args) {
        ArrayList l = new ArrayList();
        l.add(1);
        l.add(2);
        l.add(3);
        ArrayList l2 = (ArrayList)l.clone();
        l.add(4);
        for (Object c: l2.toArray()) {
         System.out.println(c);
        }
    }
}
```
Output
```
1
2
3
```

## JavaScript
JavaScript has as of a few years back something called the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) which you write as `...` and it can be used on iterable objects to get all members.
```js
a = [1,2,3]
// Array(3) [ 1, 2, 3 ]
b = [...a]
// Array(3) [ 1, 2, 3 ]
a[0]=0
// 0
a
// Array(3) [ 0, 2, 3 ]
b
// Array(3) [ 1, 2, 3 ]
```

## Python
Python has the basic `list` dynamic array type which uses the `[]` notation to construct it but you can call the constructor like `list()` too. To make a copy it you can use the `[:]` slice notation which does various forms of shallow copies of the list.

```py
a = [1, 2, 3]
b = a[:]
a[0] = 0
print(b)
# [1, 2, 3]
a = b[::-1]
print(a)
# [3, 2, 1] Yes it got reversed
a = a[1:2]
print(a)
# [2]
a = b[::2]
print(a)
# [1, 3]
a = b[-2::]
print(a)
# [2, 3]
```
Up to 3 numbers are specified in the slice notiation of the form `[start:end:skip]` where start is the start position (inclusive) and end is the end position (exclusive) and skip is how many steps it will take between and negative is allowed in all the arguments where a negative skip will reverse. Negative starts will start reading at the specified index at the end of the list.

### array and copy module
Python also has an array type called [array](https://docs.python.org/3/library/array.html) but in all the decades of me programming in Python I have used it about once but this is how you use it together with the [copy](https://docs.python.org/3/library/copy.html) module with calls the `__copy__` special method.
```py
import array
import copy

a = array.array("i", [1, 2, 3])
print(a)
# array('i', [1, 2, 3])
b = copy.copy(a)
a[0] = 0
print(b)
# array('i', [1, 2, 3])
```

The copy module also supports deep copying which is very convenient for when you actually want to deep copy an object.

```py
import array
import copy

a = [['A', 'B', 'C'], 1, 2, 3]
b = copy.deepcopy(a)
a[0].insert(0, 0)
print(a)
# [[0, 'A', 'B', 'C'], 1, 2, 3]
print(b)
# [['A', 'B', 'C'], 1, 2, 3]
```

## C
C is a bit unusual compared to most modern languages as you operate pretty much in raw memory. This means that you can cast any type to any other type and this means also that you do not need to know the type of the thing you copy with `memcpy` but you do need to know the memory areas and the size of the array in memory.

```c
#include <stdio.h>
#include <string.h>

void printArray(int* a, int len) {
  for(int i = 0; i < len; i++) {
    printf("Position %d = %d\n", i, a[i]);
  }
}

int main() {
  int a[] = {1, 2, 3};
  int b[3];
  memcpy(b, a, sizeof(a));
  a[0] = 0;
  printArray(b, 3);
  printf("%d is the size of the array in memory\n", sizeof(a));

}
```
Output
```
Position 0 = 1
Position 1 = 2
Position 2 = 3
12 is the size of the array in memory
```

You might be confused why 12 is the memory size of the array when it has only 3 elements. The reason for that is that an integer in this version of C on this platform has a memory size of 4 bytes. The platform is ARM 64 bit here if you wonder. When it comes to stuff like casting and memory it has been common for some C programmers to create a struct type for example then cast it to a byte array to send over network and that is the reason why the struct module in Python is called that.

## PHP
Want to copy an array in PHP? The bigger question is how to not copy an array in PHP. Assigning a variable to another variable will copy it almost completely.

```php
<?php
$a = [1, 2, 3];
$b = $a;
$c = &$a;
$a[] = 4;
echo json_encode($a), "\n";
# [1,2,3,4]
echo json_encode($b), "\n";
# [1,2,3]
echo json_encode($c), "\n";
# [1,2,3,4]
```

If you thought it stopped at a shallow copy the answer is no. It is a deep copy (or perhaps copy on write) and will copy all the way down.

```php
<?php
$a = ["meow", [1,2,3]];
$b = $a;
$a[1][] = 4;
echo json_encode($a), "\n";
# ["meow",[1,2,3,4]]
echo json_encode($b), "\n";
# ["meow",[1,2,3]]
```

There is however one specific exception to when something is copied and that is objects. Objects won't be automatically copied like everything else.

```php
<?php
class A {
  public string $value;
  public function __construct($in = "meow") {
    $this->value = $in;
  }
}
$a = new A;
$b = $a;
$a->value = "mew";
echo $a->value, "\n";
# mew
echo $b->value, "\n";
# mew
```

## Erlang

Now for the strangest one. Want to know to to copy an array in Erlang? You simply don't. Everything is immutable in Erlang so once a variable has been assigned a value it is set in stone and can never be changed. The variable can have different values in different invocations of the same function but that is it. Erlang also has no normally shaped stack and no iteration so you can do infinite recursion using something called trampolines. Also the language syntax is a bit unusual which you can see below.

```erlang
moan(A) -> io:fwrite("the value is ~w~n", [A]).
meow(B) ->
  moan(B),
  % the value is 1
  A=B,
  moan(A).
  % the value is 1
main(_) -> 
  A=1,
  meow(A).
```
