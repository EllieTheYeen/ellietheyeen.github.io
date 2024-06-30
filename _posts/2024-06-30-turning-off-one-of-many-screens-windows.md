---
layout: post
title: Turning off one of many screens on Windows 10 programmatically
date: 2024-06-30 17:05
tags:
- streamdeck
- windows
- python
- gaming
- shell
---
Lets say you have a computer setup like I do where you have 2 computers and one of them is a gaming computer using the middle screen that is on at times and the rest is a computer for everything else using several screens (more than 2) including the middle screen.

Some people might say to use `displayswitch.exe` that is a part of Windows and it might work SOMETIMES but there is no guarantee that it will do the correct thing if you are using more than 2 screens as it is for when you have a computer with 2 screens and want to switch between the modes of them of mirroring, extending and only having one of them on at a time.

The reason is that I say SOMETIMES is that `displayswitch.exe` might do the right thing sometimes as it considers one monitor the primary and all the other monitors the secondary monitor but the primary defined in the Windows config is not necessarily the monitor that `displayswitch.exe` considers the main monitor. So this might work but there is no guarantee and if you have a more complex setup this will not work at all.

What we are interested in is automating the whole switching of displays to make it as convenient as possible and I first thought that this registry setting was the key to it but apparently not even if it does change.

```diff
4c4
< "Attach.ToDesktop"=dword:00000000
---
> "Attach.ToDesktop"=dword:00000001
```

The optimal solution to this turned out to be to be quite strange and is to set the display resolution to zero and this after working on it for several months I got that solution from ChatGPT after it suggested many bad solutions until I asked it to do it in C and got the code that works for it in Python using `win32api`.

Here is the solution for it which I could use for my stream deck and how it works is that it turns off the screen by setting the resolution to zero to turn the screen off but does not save those settings to the registry and the way it turns the display on again is resetting the settings from the registry.

`display4toggle.py`
```python
#!/usr/bin/python
import win32api, win32con, argparse

screenid = 4

a = argparse.ArgumentParser()
a.add_argument("on", nargs="?", default=False, type=lambda x: x.lower() not in ("false", "0", "off"))
b = a.parse_args()

screenstring = f"\\\\.\\DISPLAY{screenid:d}"

if b.on:
    win32api.ChangeDisplaySettingsEx(screenstring, None)
else:
    s = win32api.EnumDisplaySettings(screenstring, win32con.ENUM_CURRENT_SETTINGS)
    s.PelsWidth = 0
    s.PelsHeight = 0
    win32api.ChangeDisplaySettingsEx(screenstring, s)
```

To then use the stream deck for this I simply create an action that has the path to the script prepended by the python path and 0 or 1 depending if I want to turn it on or off and set it as a multi-action switch in the Stream deck settings and now I can with a single button press turn on or off the monitor so the gaming pc can use it when needed.
