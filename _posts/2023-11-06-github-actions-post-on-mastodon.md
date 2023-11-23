---
layout: post
title: Posting on Mastodon with GitHub Actions
date: 2023-11-06 14:15 +0100
tags:
- github
- mastodon
- python
---
So you might wonder if GitHub Actions can be used to make posts on Mastodon for simple bots such as to do stuff like maybe you want a [Mastodon comment section](https://www.kylereddoch.me/2023/02/13/adding-mastodon-comments-jekyll-blog.html) or something like that and do not want to manually have to add the ids or store them externally.

I decided to actually try that out by making a test project where it actually is what is done.  
https://github.com/ellietheyeen/MastodonActionTest

It is recommended to read the [documentation](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions) for GitHub actions in order to understand how things vaguely work if you want to try this yourself but I will explain a bit how it works.

This obviously requires a few things like you storing the token for Mastodon as a secret inside the environment of the repository and such and give the actions of that repository write access to your repository. We should look a bit at the code which is used to achieve this.

There are 3 files that are required to pull this of.
1. `actions.yml` inside the actions repository
2. `.github/workflows/whatever.yml`
3. The runnable file to be executed and do the actions
It is possible to sort of do this in a single file but it can be very confusing code wise to do.

Here is the `actions.yml` in the actions repository
```yml
name: Mastodon Action Test
description: 'A github action that tests if it can post to Mastodon and save the id'

author: Ellie The Yeen <42704150+EllieTheYeen@users.noreply.github.com>

runs:
  using: composite
  steps:
    - run: wget https://raw.githubusercontent.com/EllieTheYeen/MastodonActionTest/main/action.py
      shell: bash
    - run: python3 action.py -name '${{ inputs.name }}' -email '${{ inputs.email }}' -branch '${{ inputs.branch }}' -instance '${{ inputs.instance }}' -blogbase '${{ inputs.blogbase }}'
      shell: bash

inputs:
  name:
    description: Author
    required: false
    default: Mastodon Action Test
  email:
    description: Mail address
    required: false
    default: 42704150+EllieTheYeen@users.noreply.github.com
  branch:
    description: Git branch target
    required: false
    default: ${{ github.head_ref }}
  instance:
    description: Mastodon instance in the form like https://mastodon.social
    required: true
    default: https://botsin.space
  blogbase:
    description: Jekyll instance in the form like https://ellietheyeen.github.io/Test
    required: true
    default: https://ellietheyeen.github.io/Test
```
Here various config is defined like how the Python script should run and what parameters should be used.

Here is the configuration file that should be inside the target repository where Jekyll is installed so it runs and checks for new posts using the action that then posts. It should be placed at `.github/workflows/whatever.yml` and yes the yml file can have almost any name. You need to fill this out with your own config if you intend to use it. The secret token is stored elsewhere but referenced here.
```yml
name: mastodonactiontest
on:
  push:
    branches:
      - main
  #workflow_dispatch:
jobs:
  mastodonactiontest:
    runs-on: ubuntu-latest
    name: mastodonactiontest
    environment: myenv
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: mastodonactiontest
        uses: EllieTheYeen/MastodonActionTest@v1
        env:
          MASTODON_TOKEN: ${{ secrets.MASTODON_TOKEN }}
        with:
          name: Mastodon Action Test
          email: 42704150+EllieTheYeen@users.noreply.github.com
          branch: main
          instance: https://botsin.space
          blogbase: https://ellietheyeen.github.io/Test
```

Here in `action.py` is what code is actually is being run and doing the Mastodon posting. It uses the GitHub actions checkout and then checks for new posts files and if there are new ones it posts them on Mastodon assuming all the config is right and nothing goes wrong like the token being missing.
```py
#!/usr/bin/python3
import urllib.request
import argparse
import shlex
import json
import csv
import os
import re


def print_and_run(a):
    print(a)
    os.system(a)


post_regex = re.compile(r"^[0-9]{4}-[0-9]{2}-[0-9]{2}-.*\.md$")

if __name__ == "__main__":
    pars = argparse.ArgumentParser()
    pars.add_argument("-name", dest="name", required=True)
    pars.add_argument("-email", dest="email", required=True)
    pars.add_argument("-branch", dest="branch", required=True)
    pars.add_argument("-instance", dest="instance", required=True)
    pars.add_argument("-blogbase", dest="blogbase", required=True)
    args = pars.parse_args()

    key = os.environ.get("MASTODON_TOKEN")
    if not key:
        exit(
            "MASTODON_TOKEN not found. Check your secrets and environments config for your repository"
        )

    print(os.getcwd())

    print_and_run(f"git config user.name {shlex.quote(args.name)}")
    print_and_run(f"git config user.email {shlex.quote(args.email)}")
    print_and_run(f"git checkout {shlex.quote(args.branch)}")

    post_file = "all_posts.csv"
    posts = {}
    try:
        with open(post_file) as f:
            for a in csv.reader(f, dialect="unix"):
                if not a:
                    continue
                posts[a[0]] = a[1]
    except:
        pass

    found = None
    for a in os.listdir("_posts"):
        if not a:
            continue
        if not post_regex.match(a):
            continue
        if a not in posts:
            found = a
            break
    else:
        print("No new posts found, exiting")
        exit()

    msg = (
        f"New post: {args.blogbase}/{found.replace('-', '/', 3).rsplit('.', 1)[0]}.html"
    )
    print(msg)

    a = urllib.request.urlopen(
        urllib.request.Request(
            f"{args.instance}/api/v1/statuses",
            headers={
                "Authorization": "Bearer " + key,
                "Content-Type": "application/json",
            },
        ),
        data=json.dumps(dict(status=msg)).encode("utf-8"),
    )
    d = a.read()
    a.close()
    g = json.loads(d)

    if "id" not in g or "url" not in g:
        print("error when posting")
        exit(g)

    print(f"Posted with id {g['id']!r}")

    with open(post_file, "a") as f:
        c = csv.writer(f, dialect="unix")
        c.writerow([found, g["id"]])

    print_and_run(f"git add {shlex.quote(post_file)}")
    commit_msg = f"Update posts.csv with post {shlex.quote(g['url'])}"
    print_and_run(f"git commit -m {shlex.quote(commit_msg)}")
    print_and_run(f"git push origin {shlex.quote(args.branch)}")
```

This was quite an interesting project to do and it might be used to implement something like a Mastodon comment section or just in general having all your blog posts go on social media. As I have a crossposter set up that reposts all posts from Mastodon to other social media it gives each blog post a link to quite a few places if posted.

GitHub actions and especially how it interacts with the shell was the toughest part to get working and if you check all our commits you might see that it was quite a few before we got something working.

This could probably be seen as more of a proof of concept than a thing that will generally be used often as few people want to probably put their social media credentials to actions on GitHub as it could be seen as a very strange things to do.

What is to also note is that it is important that the file called `all_posts.json` properly gets committed and pushed as it is used for later times to check what posts have been or not have been posted. It does however come with an annoyance that you have to pull every time you make a post as the latest commit will do some changes to the repository. There are probably some branch related or using several repositories that could somehow solve this but it is not something I do think is super important to solve.

Another thing to think about is what can really be done to prevent it from trying to repost unpostable things such as if there was some status that would return an error message every time it could get stuck each time you commit and fail and how to make that retry later could involve quite some state.

I avoided using too many dependencies here both because they were not needed and to install a lot of things would probably make the actions very slow and I have not even checked if actions are allowed to install things on the runner and what ways it would be allowed to install things if that is the case.

This is something that we will likely continue to do something with like adding a comment section using it even tho it can feel like a clunky solution it can be like a small fun addition in addition to the Disqus comment section.

Actions can be used to do a lot of things on GitHub like testing both on pushed and on pull requests or do builds or run bots like this whole post is about. I wonder what kinds of other fun things people have done with it especially unconventional things that are more for fun.

Anyway feel free to use the code here for what you want as it is quite something that would be fun to see people using.

