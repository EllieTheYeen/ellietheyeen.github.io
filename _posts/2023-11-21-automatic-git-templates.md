---
layout: post
title: Automatic Git commit templates generator
date: 2023-11-21 13:14
---
Git has a feature where you are able to set a template message for every commit you do by specifying a file either in config or as a command line argument. This might not seem as useful on its own as it is a static message that appears every single time as a base for your commit message and does not allow any variables. There is however a thing you can do in order to change that.

Here is what you can do. Make an alias for your git commit that will run a command every time you run it to fill in the message. There are a few ways to do this where one is something like `git commit --template <(somecommand)` however this has a certain issue if you write it like that. The problem comes when you try to exit the text editor that git opens it will still do a commit even if you do not change the message or save (Tell in comments if you actually know why since this is really interesting why it happens).

There is a thing we can do to fix this. First we make a program to generate a fancy commit message and save to a file and second we make a program, script or alias that when git is run it is taking that file in as the template argument. Below is an example of a program that generates commit messages very similar to how GitHub does it automaticaly by listing the changed file and how it was changed.
```py
#!/usr/bin/python3
import subprocess


p = subprocess.Popen("git diff --name-status --cached", shell=True, stdout=subprocess.PIPE)
s = p.wait()
c = p.communicate()
o = c[0].decode("utf-8")

modified = []
deleted = []
added = []
for l in o.split("\n"):
    s = l.split(None, 1)
    if not s: continue
    a, b = s
    if a == "A": # Create
        added.append(b)
    elif a == "D": # Delete
        deleted.append(b)
    elif a == "M": # Update
        modified.append(b)

out = []

if added:
    out.append(f"Create {' '.join(added)}")
if deleted:
    out.append(f"Delete {' '.join(deleted)}")
if modified:
    out.append(f"Update {' '.join(modified)}")

print("\n".join(out))
# Save this file as makegwtemp somewhere in your path
```
Now that We have a program that generates the commit message we need a second thing that is below that will run `git commit` with teh template argument set to the file.
```bash
#!/bin/bash
git status >/dev/null 2>&1
s=$?
if [[ "$s" != 0 ]]; then
  echo Not a git repository
  exit 1
fi
makegwtemp > gittemplate.txt
git commit --template gittemplate.txt "$@"
rm gittemplate.txt
```
Now if we run this it will start up nano with the following prefilled inside it and if we save it it will do the commit and we do not have to write out own commit messages.
```sh
Create _posts/2023-11-21-automatic-git-templates.md
Update index.md

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# On branch main
# Your branch is up to date with 'origin/main'.
#
# Changes to be committed:
#       new file:   _posts/2023-11-21-automatic-git-templates.md
#       modified:   index.md
#
```
Now we can just enjoy the ease of not having to write commit messages for simple commits.
