---
layout: post
title: Command line poster for Twitter, Mastodon and Bsky
date: 2023-12-14 13:12
tags:
- mastodon
- twitter
- python
- shell
- bsky
---
Decided to make a command line poster for Twitter, Mastodon and Bsky. It does not support posting images at least yet but it does support CWs. I hastily created it from converting my Discord bot so the code might be a bit messy but it works great. It has some unusual error handling that I implemented in case of smaller faults regarding previews. The code is below and feel free to use it for what you want.

```py
#!/usr/bin/python3
import traceback
import datetime
import typing
import types
import json
import sys
import os
import re
import io

import httpx


def getmast():
    global mast
    try:
        return mast
    except NameError:
        pass

    import mastodon

    access_token = ...  # Replace with Mastodon token
    api_base_url = "https://mastodon.social" # Replace with your instance
    mast = mastodon.Mastodon(
        mastodon_version="1.4.3",
        access_token=access_token,
        api_base_url=api_base_url,
    )
    return mast


def gettwit():
    global ntwt

    try:
        return twit
    except NameError:
        pass

    import tweepy

    bearer_token = ...  # Replace this with twitter bearer_token
    consumer_key = ...  # Replace this with twitter consumer_key
    consumer_secret = ...  # Replace this with twitter consumer_secret

    access_token = ...  # Replace this with twitter access_token
    access_token_secret = ...  # Replace this with twitter access_token_secret

    api1 = tweepy.API(
        tweepy.OAuth1UserHandler(
            consumer_key=consumer_key,
            consumer_secret=consumer_secret,
            access_token=access_token,
            access_token_secret=access_token_secret,
        ),
        wait_on_rate_limit=False,
    )
    api2 = tweepy.Client(
        bearer_token=bearer_token,
        consumer_key=consumer_key,
        consumer_secret=consumer_secret,
        access_token=access_token,
        access_token_secret=access_token_secret,
        wait_on_rate_limit=False,
    )

    twit = api1, api2
    return twit


def getbsky():
    global bsky
    import atproto

    username = ...  # Replace this with bsky username (something.bsky.social)
    password = ...  # Replace this with bsky password (Maybe app password)

    fdir = os.path.split(__file__)[0]
    sessionfile = os.path.join(fdir, f"{username}.json")

    try:
        if bsky._should_refresh_session():
            bsky._refresh_and_set_session()

            odata = dict(
                did=client.me.did,
                handle=client.me.handle,
                access_jwt=client._access_jwt,
                refresh_jwt=client._refresh_jwt,
            )
            with open(sessionfile, "w") as f:
                print(json.dumps(odata, indent=4), file=f)
        return bsky
    except NameError:
        pass

    client = atproto.Client()
    try:
        with open(sessionfile) as f:
            odata = json.load(f)
        ses = types.SimpleNamespace(
            did=odata["did"],
            handle=odata["handle"],
            access_jwt=odata["access_jwt"],
            refresh_jwt=odata["refresh_jwt"],
        )
        client._set_session(ses)
        client.me = types.SimpleNamespace(
            did=odata["did"],
            handle=odata["handle"],
        )
    except Exception:  # No idea what this throws but it should be tested at some point
        traceback.print_exc()
        print("Could not find session, Logging in")
        client.login(username, password)
        odata = dict(
            did=client.me.did,
            handle=client.me.handle,
            access_jwt=client._access_jwt,
            refresh_jwt=client._refresh_jwt,
        )
        with open(sessionfile, "w") as f:
            print(json.dumps(odata, indent=4), file=f)

    if client._should_refresh_session():
        client._refresh_and_set_session()
        odata = dict(
            did=client.me.did,
            handle=client.me.handle,
            access_jwt=client._access_jwt,
            refresh_jwt=client._refresh_jwt,
        )
        with open(sessionfile, "w") as f:
            print(json.dumps(odata, indent=4), file=f)
    bsky = client
    return bsky


def makewrap(func, desc):
    def onwrap(msg):
        with ErrorWrap():
            reply = func(msg)
            gen = maybegenerator(reply)
            try:
                ret = next(gen)
                while True:
                    # mid = sendmsg(chan, ret)
                    print(ret)
                    ret = next(gen)
                    # ret = gen.send(mid)
            except StopIteration:
                pass

    return onwrap


# General functions


class Message(Exception):
    pass


class ErrorWrap:
    def __init__(
        self,
        message: typing.Optional[str] = None,
    ) -> None:
        self.message = message

    def __enter__(self) -> None:  # TODO: Add subtask describer
        pass

    def __exit__(self, t: type, e: BaseException, b: traceback) -> None:
        # print(e, t, b)
        if not isinstance(e, Exception):
            return False
        if isinstance(e, Message):
            text = " ".join(str(a) for a in e.args)
        else:
            text = (
                f"Error in {self.appname} while {self.message}\n"
                if self.message
                else ""
            ) + traceback.format_exc()
        print(text)
        return True


def makeerrorwrap():
    def wrapper(msg):
        return ErrorWrap(msg)

    return wrapper


def maybegenerator(
    value: typing.Union[types.GeneratorType, typing.Any]
) -> typing.Iterable:
    if isinstance(value, types.GeneratorType):
        yield from value
    elif value is not None:
        yield value


httx = httpx.Client(
    timeout=10,
    follow_redirects=True,
    headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0"
    },
)

mastcmds = (
    "p",
    "pp",
    "pc",
    "ppc",
)
othercmds = (
    "bp",
    "tp",
    "tbp",
)
allcmds = mastcmds + othercmds


def onmsg(cont):
    cmd = cont[0] if len(cont) else ""
    args = cont[1:]

    if not cont:
        yield f"All commands: {' '.join(allcmds)}"
        return

    if cmd in mastcmds:
        text = " ".join(args).strip()
        cw = None
        if "c" in cmd:
            s = text.split("\n", 1)
            if len(s) < 2:
                raise Message(
                    "Requires 2 rows where first is cw and others are message or an attachment"
                )
            cw = s[0]
            text = len(s) >= 2 and s[1] or ""
        elif text.startswith(("CW:", "CW ")):
            cw, *t = map(str.strip, text[3:].split("\n", 1))
            text = t[0] if t else ""
        if not text:  # or not msg["attachments"]:
            raise Message("Requires args to post")

        mast = getmast()

        mediaids = []
        sensitive = False

        visibility = "public" if cmd.startswith(".pp") else "unlisted"
        yield mast.status_post(
            status=text,
            media_ids=mediaids,
            sensitive=sensitive,
            spoiler_text=cw,
            visibility=visibility,
        )["url"]
    elif cmd in othercmds:
        dotwitter = True
        dobluesky = True
        if cmd == "bp":
            dotwitter = False
        elif cmd == "tp":
            dobluesky = False

        text = " ".join(args).strip()

        if not text:  # and not msg["attachments"]:
            raise Message("Requires args or attachments to post")

        pics = []
        sensitive = False

        catch = makeerrorwrap()

        if dotwitter:
            with catch("posting on twitter"):
                if len(text) > 280:
                    raise Message(
                        f"Text length is {len(text)} (max 280) and will therefore not be posted on twitter"
                    )

                t1, t2 = gettwit()

                mediaids = []
                for pic in pics:
                    med = t1.media_upload("file.png", file=io.BytesIO(pic["data"]))
                    data = {
                        "alt_text": {
                            "text": (
                                pic["alt"]
                                or "Alt text seems to be missing and is likely a bug"
                            )[:1000]
                        },
                        "media_id": str(med.media_id),
                    }

                    if sensitive:
                        data["sensitive_media_warning"] = [
                            # "other",
                            # "graphic_violence",
                            "adult_content"
                        ]

                    t1.request(
                        "POST",
                        "media/metadata/create",
                        json_payload=data,
                        upload_api=True,
                    )
                    mediaids.append(med.media_id)

                post = t2.create_tweet(
                    text=text,
                    media_ids=mediaids or None,
                )

                yield f"https://fxtwitter.com/i/status/{post.data['id']}"

        if dobluesky:
            with catch("posting on bluesky"):
                if len(text) > 300:
                    raise Message(
                        f"Text length is {len(text)} (max 300) and will therefore not be posted on bluesky"
                    )

                bsky = getbsky()

                embed = None
                if pics:
                    images = []
                    for pic in pics:
                        upload = bsky.com.atproto.repo.upload_blob(
                            pic["data"], timeout=60
                        )
                        images.append(
                            {
                                "$type": "app.bsky.embed.images#image",
                                "alt": pic["alt"],
                                "image": upload.blob,
                            }
                        )
                    embed = {"$type": "app.bsky.embed.images", "images": images}

                facets = []
                firstlink = None
                for match in re.finditer(
                    rb'https?://[^\t\n\ "\'<>\\\^\{\|\}]+', text.encode("utf-8")
                ):
                    link = match.group().decode("utf-8")
                    if not firstlink:
                        firstlink = link
                    span = match.span()
                    facets.append(
                        {
                            "$type": "app.bsky.richtext.facet",
                            "features": [
                                {
                                    "$type": "app.bsky.richtext.facet#link",
                                    "uri": link,
                                }
                            ],
                            "index": {
                                "$type": "app.bsky.richtext.facet#byteSlice",
                                "byteStart": span[0],
                                "byteEnd": span[1],
                            },
                        }
                    )

                if embed is None and firstlink:
                    with catch(f"getting URL preview for {firstlink!a}"):
                        resp = httx.get(
                            "https://cardyb.bsky.app/v1/extract",
                            params=dict(url=firstlink),
                        )
                        resp.raise_for_status()
                        jdat = resp.json()
                        if jdat.get("error"):
                            raise ValueError(
                                f"Error from previewer: {jdat.get('error')!a}"
                            )
                        embe = {"$type": "app.bsky.embed.external#external"}
                        embe["uri"] = firstlink
                        embe["description"] = jdat.get("description", "No description")
                        embe["title"] = jdat.get("title", "No title")
                        with catch(f"handling preview picture {jdat.get('image')!a}"):
                            if imgurl := jdat.get("image"):
                                ires = httx.get(imgurl)
                                ires.raise_for_status()
                                upload = bsky.com.atproto.repo.upload_blob(
                                    ires.content, timeout=10
                                )
                                embe["thumb"] = upload.blob
                            embed = {
                                "$type": "app.bsky.embed.external",
                                "external": embe,
                            }

                labels = None
                if sensitive:
                    labels = {
                        "$type": "com.atproto.label.defs#selfLabels",
                        "values": [{"val": "porn"}],  # sexual, nudity, porn
                    }

                post = bsky.com.atproto.repo.create_record(
                    {
                        "repo": bsky.me.did,
                        "collection": "app.bsky.feed.post",
                        "record": {
                            "$type": "app.bsky.feed.post",
                            "created_at": datetime.datetime.now(
                                tz=datetime.timezone.utc
                            )
                            .replace(tzinfo=None)
                            .isoformat(timespec="milliseconds")
                            + "Z",
                            "facets": facets,
                            "text": text,
                            # "reply": replyto,
                            "embed": embed,
                            "labels": labels,
                            "langs": ["en"],
                        },
                    },
                    timeout=60,
                )

                uri = post.uri.rsplit("/", 2)[-1]
                yield f"https://bsky.app/profile/{bsky.me.did}/post/{uri}"
    else:
        yield "Unknown command"


if __name__ == "__main__":
    makewrap(onmsg, "posting")(sys.argv[1:])
```
