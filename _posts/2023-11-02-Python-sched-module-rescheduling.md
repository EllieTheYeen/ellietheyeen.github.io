---
layout: post
date:   2023-11-02 13:42:03 +0100
title:  Python sched module and rescheduling
tags:
- python
- sched
- concurrency
---
Lets say you have some code that is waiting for a state to settle and you want to be able to make sure it really settles before trying to do anything with it. Or maybe you want to make a simple [Watchdog timer](https://en.wikipedia.org/wiki/Watchdog_timer) or [Dead man's switch](https://en.wikipedia.org/wiki/Dead_man%27s_switch) mechanism. You can look at the Python built in module `sched`.

<https://docs.python.org/3/library/sched.html>

What sched does is it lets you make a scheduler that you can queue tasks in and run.  
Simply make a scheduler object and you have a scheduler you can queue what tasks you want in it using the `scheduler.enter` method.

What you need to also need to know is that you need to call the run method of the scheduler object periodically in the thread you want to run the tasks in periodically. This can either be done blocking or non blocking by setting the block argument to True when calling the run method.

When it comes to cancelling tasks which is something you might want to do if you want to reschedule a task further on instead it is not possible to make a task run later but you must instead cancel the task and schedule it again. This has to do with the type returned from the enter method is a named tuple therefore immutable and also there could be issues with thread safety if you were able to change it.

Below is an example how you could make a simple scheduler with a rescheduling task that runs in another thread. Every time you press enter the time when the function is called will be postponed. When you eventually have not pressed enter in a while it will print *barks* and exit the program the next time you press enter. The act of resetting a watchdog timer like this can be referred to as "kicking the dog". The try clause that catches `ValueError` in the bottom is used to detect if the task was executed or not since if it was we do not want to try to reschedule it as it has already happened.
{% gist 3d5a5fe67dc294d1c078c678864eb496 %}
The arguments to the `scheduler` constructor are first something to be used to tell the time and it could be either `timer.monotonic` or `time.time` and the second argument is what to use when sleeping such as `time.sleep` but you can of course only run it periodically in other ways or wait outside the run method like is also shown in the example.

The thread in the example is a daemon thread as we want it to exit as soon as we exit the main thread. There are ways to make it stop such as having a variable that is set as soon as the program should end or using any of the [Threading Constructs](https://docs.python.org/3/library/threading.html)

Before I realized that there actually is the method `scheduler.cancel` I made some very funky code in order to compensate for that that you can see below
{% gist 9ee109680f64abde0d10ea80a25e69fa %}
There are probably use cases for code like this when you cannot cancel timers or maybe you want tasks to do something else if the dog has been kicked

Scheduling like this is mostly relevant if you are using threads as `asyncio` and `twisted` has their own methods of scheduling in single threaded environments. Those are often what you want to work with in modern Python programs anyway. The built in module `asyncio` is something that is really recommended and it has similar [Synchorinzation Privitives](https://docs.python.org/3/library/asyncio-sync.html) as `threading` does.

When it comes to scheduling there are other methods than using `sched` such as using thead [threading.Timer](https://docs.python.org/3/library/threading.html#timer-objects) type which allows you to just like `sched` run a function after a certain amount of time and also cancel it before it runs. it has however not that I know of any method to know if it has been cancelled or not and you might have to use some threading construct or variable to confirm that it has happened and not induce any race conditions while doing so. It also starts another thread for the timer which might be something you want or not want depending on your use case when scheduling.
