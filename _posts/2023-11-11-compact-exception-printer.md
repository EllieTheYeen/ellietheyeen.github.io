---
layout: post
title: Compact exception printing in Python
date: 2023-11-11 18:50
tags:
- python
- exceptions
---
So recently I had the problem of something throwing exceptions and it was like really long exceptions that went way over 4 kilobytes of text which was hard to find something useful inside. So what was needed is something that made the exceptions much easier to see and to know the messages and the type rather than the 20+ files the stacktrace went through. At first this was a tough problem that maybe the stacktrace maybe had a solution to until the following was discovered. Apparently Python exceptions have two different attributes called `__cause__` and `__context__`. What they do is they tell you what the previous exception was but they are sligthly different. `__cause__` is only set if there was something like
```python
raise ValueError("Something wrong") from e
```
while `__context__` is always set as long as a previous exception is there and otherwise it will be None.

So what had to be done not was to iterate over every `__context__` until none and for every iteration check if `__cause__` was set and use that data to do something useful like provide an useful printout of what went wrong without it being extremely long like `traceback.format_exc` is at time. So here is the code that managed to provide a compact representation of what went wrong.
```python
def compacttrace(exc: Exception, maxamount: int = 100):
    out = []
    for a in range(maxamount):
        out.append(ascii(exc))
        if exc.__cause__:
            out.append('# Caused')
        elif exc.__context__:
            out.append('# Happened')
        exc = exc.__context__
        if not exc:
            break
    return "\n".join(reversed(out))
```
Now lets run some code that will both throw some exceptions caused and during to test it.
```python
try:
    try:
        try:
            1 / 0
        except:
            ashj4et
    except Exception as e:
        raise ValueError("no") from e
except:
    print(compacttrace(sys.exc_info()[1]))
```
The output we get is the following which is way more readable than just a simple error message with or without type or traceback.
```python
ZeroDivisionError('division by zero')
# Happened
NameError("name 'ashj4et' is not defined")
# Caused
ValueError('no')
```
At first these were backwards as you get the most recent exception first and the root cause last but that is quite confusing as it is the opposite in tracebacks so the whole output is reversed using the `reversed` builtin.

Now we can simply just send this to Discord or Slack or any other chat service that supports markdown with syntax highlighting to get a readable error message.

There are probably other things that could be done like adding a line number and a file to each exception as that is what could make it more useful in certain cases where several things could throw identical errors.

So that is what I did with it and made another versions with line numbers.
```python
def compacttrace(exc: Exception, maxamount: int = 100):
    out = []
    for a in range(maxamount):
        line = exc.__traceback__.tb_lineno
        file =  exc.__traceback__.tb_frame.f_code.co_filename
        out.append(f"{exc!a} # line {line} file {file}")
        if exc.__cause__:
            out.append("# Caused")
        elif exc.__context__:
            out.append("# Happened")
        exc = exc.__context__
        if not exc:
            break
    return "\n".join(reversed(out))
```
It was sort of wonky as there was many different variables called something with lineno and they would give very strange line numbers but here is the output it will produce if given the same exception.
```python
ZeroDivisionError('division by zero') # line 122 file /home/pi/test.py
# Happened
NameError("name 'ashj4et' is not defined") # line 124 file /home/pi/test.py
# Caused
ValueError('no') # line 126 file /home/pi/test.py
```
The only things I could think of possibly doing now is to make sure it really holds up and does not crash during odd cases and such and also maybe sanitize the filenames like instead of displaying a long filename like `/home/pi/.local/lib/python3.9/site-packages/pymysql/__init__.py` it might just display `pymysql/__init__.py` and so in as we do not need the full path in most circumstances but rather just what module had what error and such.

Anyway this was a fun project and was really good to have done as I have had so much strange errors handling exceptions lately with my crossposter becoming increasingly complex every time I modify it and it is probably way over 1k lines currently and I might make a public version of it at some later point.
