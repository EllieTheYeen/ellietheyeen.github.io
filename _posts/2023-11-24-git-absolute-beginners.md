---
layout: post
title: Git for absolute beginners
date: 2023-11-24 20:44
tags:
- github
- shell
- git
---
Git is a version control system that allows you to have files stored in specific versions then compared, updated or restored and various operations related to the history of the file and any changes. This is what a version control system does. You can have multiple branches too which is different versions of the files which is good for when multiple users work on something that then gets merged into the main branch.

* 
{:toc}

## What is this article about
How to use command line git for beginners with the most obvious usable commands.

## Start
The first thing you need to make sure you have command line git installed and in your path you can test by just writing `git` in your command line and it can be preinstalled in some systems otherwise use a packet manager like [scoop](https://scoop.sh/) on Windows or apt on Linux depending on distribution.

Note that you can run any git command and append `--help` and you will get a help message how to use the command.

### Config
Now you need to do some basic configuration in order for git to actually function by setting a name and email. It does not have to be a real name of functioning email really but something sort of identifiable is recommended as it might now work otherwise and if you gpg sign your commits you need to use the email connected to it and it is tough to change later.

Here is an example of how you set the email and name globally in order to be able to commit and push.
```sh
git config --global user.email 42704150+EllieTheYeen@users.noreply.github.com
git config --global user.name Ellie The Yeen
```
Note that the email is not a real email as I am using email privacy here which GitHub and GitLab for example has which can be used to avoid spam.

These are then saved in your user folder in `.gitconfig` which you can access with the path `~/.gitconfig` as `~` gets replaced with your user folder in the shell.

### SSH keys
Git either requires HTTPS or SSH authentication where SSH is really recommended as HTTPS tends to use username and password or possibly an access token where SSH uses a SSH key.

SSH keys are typically stored in `~/.ssh/` and are named `id_rsa` for the private key and `id_rsa.pub` for the public key. What you will use is the public key and put it in [GitHub settings](https://github.com/settings/keys) in order to be able to authenticate.

If the keys do not exist there you can run the `ssh-keygen` command in order to generate them.

Now you can run
```sh
ssh -T git@github.com
```
and see if it works if it is GitHub and if it works you can now clone repositories through SSH and also push to repositories you have access to.

### Remotes
Before you can push to any remote you must add one. To add one you use the `git remote` command. You can list your remotes with `git remote -v`. Before you can add and push to a remote you must ensure it exists by adding it with the `git remote add` command.

Example of add command
```sh
git remote add origin git@github.com:EllieTheYeen/ellietheyeen.github.io.git
```

If you clone a repository you do not need to set the remote as it will be already set.

## Basic usage
Generally there are a few main commands you tend to use in normal usage of git that is `git add`, `git commit`, `git push`, `git init`, `git clone`, `git status`, `git diff` and `git pull`

### status and show
`git status` is one of the more used commands and you should use it to know the current state of which files are staged and how many commits are not pushed yet plus some more info that is useful. Use it whenever you are unsure what state you left a repository in.

`git show`  
Shows a more detailed status including the latest commit and a diff.

### init
`git init` is a command used to initialize a repository that is empty. This is good for when there is no remote or when the remote is uninitialized. It can also be used when you have not pulled anything yet.

Examples:  
```sh
git init -b main
```  
Will initialize a repository with the branch called main (It tends to default to master)

It can be set to always default to main using the config command 
```sh
git config --global init.defaultBranch main
```

The reason for it being called master in some places and main in others is a long story about some people being racist that you can probably Google if you are interested in it but it is called `main` on GitHub nowadays and it is better with a shorter name.

### add (staging)
Staging is when you add a file to be used in the commit and is done by using either the `git add` command or the `git commit` with the `-u` or `-a` flags

```sh
git add .
```  
will stage every single file in the repository if you stand in the root of it except those specified in `.gitignore`.

```sh
git add -u
```  
will stage all files in the repository that are tracked which means that they have been used in a previous commit.

There is a file called `.gitignore` where you can specify one file per line or wildcards of them of files to not stage even if you use commands like `git add -a`

If you stage a file then make a change you will need to stage it again if you want it to be included in the commit.

### restore --staged + rm ----cached (unstaging)
Sometimes you stage a file you do not want to stage and you want to get back to the previous state. For that there are two commands that are used.

```sh
git restore --staged path
```  
Will unstage a file for change and is useful for files that are tracked specifically. You can specify `.` as the path if you want to unstage all but otherwise replace path with the file you want to unstage in the command.

```sh
git rm --cached path
```  
This will remove a file in a virtual way where it will be removed from the staging but if you use this for a tracked file it will mark the file as deleted in the next commit but it can also be used to unstage a file you never intended to add that is not staged. The `--cached` argument means that the file is not removed from disk and only in the repository.

### diff
Diffing is perhaps one of the most important features in Git for debugging as you can see what lines have changed in files and what binary files have been changed. You can either diff past commits or your current staged changes. It should show up as colored lines in the terminal where red is removed ones and green is added ones.

Example of diff output
```diff
new file mode 100644
index 0000000..7f88982
--- /dev/null
+++ b/sdsdf
@@ -0,0 +1 @@
+ds
diff --git a/test.txt b/test.txt
index aa5173a..00ca2c7 100644
--- a/test.txt
+++ b/test.txt
@@ -1,3 +1,4 @@
 Fri Nov 24 05:00:32 CET 2023
 Fri Nov 24 05:00:49 CET 2023
 Fri Nov 24 05:08:51 CET 2023
+Fri Nov 24 05:25:53 CET 2023
```

```sh
git diff
```  
Diff unstaged changes towards either the staged changed if there are any or towards the last commit.

```sh
git diff --staged
```  
Diff staged changes towards the last commit. Useful to see what you did before staging more.

```sh
git diff filename
```
Diff a specific file. Useful if you have a large amount of changes.

```sh
git diff HEAD^1
```
Diff the last commit to the one before that. The 1 can be replaced with any number to diff 2 commits or with the commit id or 2 of them to diff 2 commits such as `git diff HEAD^1 HEAD^2` or `git diff e799af21e8f99d1951a7529c093afbaf05b0b327 9225cafe50355d35513582976e471a7339a0723d` where those long hex numbers are the commit ids you can get from `git log`.

```sh
git diff --name-status
```  
Display the names and statuses of changed files.

```sh
git diff --name-only
```  
Display the names of changed files.

You can combine most of these options to get the right kind of diff to debug your code. 

By default `git diff` will use a pager and if this is annoying you can just disable it with  
```sh
git config --global pager.diff false
```  
globally

### log
`git log` displays the commit log where you can see the authors, dates, commit ids and commit messages.

By default `git log` will use a pager and if this is annoying you can just disable it with  
```sh
git config --global pager.log false
```  
globally

```sh
git --no-pager log --reverse -3
```  
Will show the 3 latest commits starting with the oldest on top.

```sh
git log --graph --stat
```  
Shows an extremely fancy log with much extra info like statistics for each commit and which files were changed.

### commit
Committing is probably the main thing you will do in Git. Even if you do not push it to a remote ever it tends to be what you do unless you only ever use it to stage changes to test stuff with diffing.

A commit will take every single staged change and pack it together and save a message, date, author and so on and store it which can then be pushed to a remote or be diffed or restored to.

Examples
```sh
git commit # Will ask for a comment message by opening a text editor
git commit -m "You can set a commit message here"
git commit -u # Stage all tracked files before committing
git commit -a # Stage all changes that can be staged and commit
```

### push
Pushing is when you upload your local changes to a remote repository. You can typically push with just `git push` if it is set up correctly but you tend to need to do small configurations before you can do that.

```sh
git push # Normal push
git push origin main # Push specifically the main branch to the remote called origin
git push --set-upstream origin main # Will set the upstream to origin and push
git push --force # Will forcefully push. Useful when you want to forcefully remove things
```

### pull
A pull will fetch from the remote and update your local files. If you have made any local changes you can run `git stash` to store them away first before pulling and then restore them with `git stash pop`. 

## Undo various things
You often want to undo various things in git and it is typically done with `git reset` where `git reset --hard` will erase local changes and `git reset --soft` will not. You can specify which commit to revert to by id or using the `HEAD^1` format.

There are a lot of specific cases where you want to restore to previous states but if you want to just take a look at something use `git checkout` instead which is also the command you use for switching branches even if you can also use `git switch` for that. I recommend searching on the internet for the specific way you are trying to reset.

## Useful and needed config settings to do
There are many settings that make git easier to use such if you do not want to have pagers or similar.

Sets the default branch to main which you generally want in many places
```sh
git config --global init.defaultBranch main
```

Turns off the pager for whe you run `git diff`
```sh
git config --global pager.diff false
```

Turns off the pager when you run `git log`
```sh
git config --global pager.log false
```

## End notes
Git is a very useful tool not only for programmers but for anyone who wants to compare versions of files and see what changes have been made. Even if git is very made for text files there are addons that let you diff other kind of files too such as [images](https://github.com/ewanmellor/git-diff-image)
