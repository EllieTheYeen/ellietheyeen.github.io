---
layout: post
title: Making a Discord systemd failure handler
date: 2023-11-19 14:43
---
Did you know that systemd allows you to create special units that run only when other units fail and that they can be used to send notifications when services go down. Now we are going to look at how that would be done using Discord using Webhooks. In the screenshot below is an example of a message generated using this method that uses a discord embed with a custom profile picture.

![A Discord mesage from a bot named systemd at 10:01 with the systemd logo that is green square and triangle inside black square brackets. There is a red embed with the title: Service justfail.service failed and description: × justfail.service - This will just fail newline      Loaded: loaded (/home/pi/.config/systemd/user/justfail.service; static) newline      Active: failed (Result: exit-code) since Sun 2023-11-19 10:01:44 CET; 567ms ago newline     Process: 27410 ExecStart=sh -c echo fail; exit 1 (code=exited, status=1/FAILURE) newline    Main PID: 27410 (code=exited, status=1/FAILURE) newline         CPU: 11ms](/images/discordsystemd.png)

In order to start you want to use a command like the following in order to create or edit the unit we need in order for this to work.  
`systemctl --user edit --full --force servicefailure@.service`  
This command will edit a user systemd unit and if it does not exist it will create it if saved. We of course need to fell the unit service file in order for it to run and also have it end with an at sign un order to make this kind of unit. Below is an example of this kind of unit file that runs a Python script whenever the unit is started and also sends an arument to that script in order for it to know what unit had a failure.
```ini
[Unit]
Description=Failure handler for %i

[Service]
Type=oneshot
ExecStart=/home/pi/.cron/servicefailure/servicefailure.py %i
```
This needs to point at an existing Python script which you can place where you want as long as the user has access to it and it is marked as executable and has the proper interpreter pointed at. We use Python for this as it is a popular language that suits well for that task but this could be completely done in dash, Ruby or even PHP if you wanted. The following file is the one that should be pointed at by the unit file and it receives an argument that it uses in order to fetch the status from systemd and then sends that using a Discord WebHook to Discord with some embed formatting.
```py
#!/usr/bin/python3
import subprocess
import requests
import sys

# We specified that the failed service name was going to be sent as an argument so we get it here
service = sys.argv[1]
status = f"Service {service} failed"
print(status)

# Run the systemctl status command for the service that just failed
proc = subprocess.Popen(
    f"systemctl --user status {service}", stdout=subprocess.PIPE, shell=True
)
# This is a tuple of 2 bytes objects for stdout and stderr so we want the stdout as a string
output = proc.communicate()[0].decode("utf-8")

# Generally I would recommend putting more error handlers here that tell if something goes wrong through notifications

color = 0xFF0000  # Red
o = dict(
    # Create one embed with the color, the title and the status
    embeds=[dict(color=color, title=status, description=output)],
    # Set a username below in case you do not set it elsewhere in for example hook config
    username="systemd",
    # Set the logo as url here that the webhook is going to use if you do not set it in hook config
    #avatar_url=None,
)
# This string below must be set to a Discord WebHook URL for this to work
hook = ""
# Do a post with requests
d = requests.post(hook, json=o, params=dict(wait="true"))
# Print so we can see any errors in this through journalctl
print(d.text)
```
When this is ready and you have configured it correctly there is just one step left in order to to make use of this. We have to point services that when they fail should start our error handler unit and you can do this on every single unit as long as it is the same user or system wide but then you should not use the `--user argument`. Yes you can in fact make this tell on Discord if your Discord bot goes down as webhooks are not dependent on a specific Discord bot being online.
```ini
[Unit]
Description=Discord bot
OnFailure=servicefailure@%n.service

[Service]
ExecStart=/home/pi/bots/discord/discordbot.py
```
Take note of the `OnFailure` line which defines that the following unit should use the failure handler.

There are many quirks and such in systemd configuration and you should look at [the documentation](https://www.freedesktop.org/software/systemd/man/latest/systemd.unit.html "Systemd unit documentation") in order to understand better if you want to go into detail as there are many format specifiers like `%i` and `%n` for units.

This was a small fun project that has been extremely useful in knowing what services go down in systemd and if you have a Linux machine with systemd we really recommend looking into the more fun features it has.

*Mweeoops*
