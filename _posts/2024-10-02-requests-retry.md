---
layout: post
title: How to configure Requests in Python to retry
date: 2024-10-02 21:24
tags:
- requests
- python
- php
---
There is a HTTP library for Python called Requests that is very widely used with a user friendly interface for most things except how to actually set how many retries it should do.

The reason I started to look into this is that my internet has been strangely unstable with opened TCP connections lately which I have not been able to track down but seems to be some routers fault.

We are going to start by creating a PHP script that will sleep for a random amount of seconds in order to simulate a timeout.

`delay.php`
```php
<?php
$i = rand(1, 5);
sleep($i);
echo "Slept for $i";
```

Next we are going to set up requests to handle retries which can be done in 2 different ways. The first is the more official way

```py
ses = requests.Session()
adapter = requests.adapters.HTTPAdapter(max_retries=3)
ses.mount('http://', adapter)
ses.mount('https://', adapter)
```

and the second is a more hacky way

```py
ses = requests.Session()
ses.adapters['http://'].max_retries.total = 3
ses.adapters['https://'].max_retries.total = 3
```

Now in order to test the code we can put it all together and run it like following.

`timeouttest.py`
```py
import requests
ses = requests.Session()
adapter = requests.adapters.HTTPAdapter(max_retries=3)
ses.mount('http://', adapter)
ses.mount('https://', adapter)

# The address here is just where I locally placed the script as an example
a = ses.get('http://192.168.0.31/delay.php', timeout=2.5)
print(a.text)
```

Notice the timeout parameter. It is something that really should be set in any form of production code. Now when run it will retry on failure and to see this we can either see the server log or use logging. I recommend `coloredlogs` which you can install with `pip install coloredlogs` and start like following.

```py
import coloredlogs
coloredlogs.install(0)
```

And when we run the tests we can see that request does retries in the python log

```log
2024-10-02 21:12:41 clear urllib3.connectionpool[104082] DEBUG Starting new HTTP connection (1): 192.168.0.31:80
2024-10-02 21:12:44 clear urllib3.util.retry[104082] DEBUG Incremented Retry for (url='/delay.php'): Retry(total=2, connect=None, read=None, redirect=None, status=None)
2024-10-02 21:12:44 clear urllib3.connectionpool[104082] WARNING Retrying (Retry(total=2, connect=None, read=None, redirect=None, status=None)) after connection broken by 'ReadTimeoutError("HTTPConnectionPool(host='192.168.0.31', port=80): Read timed out. (read timeout=2.5)")': /delay.php
2024-10-02 21:12:44 clear urllib3.connectionpool[104082] DEBUG Starting new HTTP connection (2): 192.168.0.31:80
2024-10-02 21:12:46 clear urllib3.connectionpool[104082] DEBUG http://192.168.0.31:80 "GET /delay.php HTTP/1.1" 200 11
Slept for 2
```

And in the Apache log

```log
192.168.0.21 - - [02/Oct/2024:21:12:44 +0200] "GET /delay.php HTTP/1.1" 200 215 "-" "python-requests/2.32.3"
192.168.0.21 - - [02/Oct/2024:21:12:41 +0200] "GET /delay.php HTTP/1.1" 200 215 "-" "python-requests/2.32.3"
```

Unfortunately I cannot find any easy way to set the timeout by default. However it is possible to override the adapter like following to make all requests using the created session to have a specific timeout even tho I wish there was some more elegant way to do this.

```py
import requests
import urllib3

class DefaultsAdapter(requests.adapters.HTTPAdapter):
    defaults = {}
    
    def __init__(self, *a, defaults=None, **k):
        if defaults:
            self.defaults = defaults or {}
        super().__init__(*a, **k)
        
    def send(self, *a, **k):
        for key, value in self.defaults.items():
            k[key] = value
        return super().send(*a, **k)

ses = requests.Session()
adapter = DefaultsAdapter(
    defaults=dict(timeout=2.5),
    max_retries=urllib3.util.retry.Retry(total=3),
)
ses.mount('http://', adapter)
ses.mount('https://', adapter)
```

Other clients such as [httpx](https://www.python-httpx.org/advanced/timeouts/) has a convenient way to set both [timeout](https://www.python-httpx.org/advanced/timeouts/) and [retries](https://www.python-httpx.org/advanced/transports/#http-transport) according to the [manual](https://www.python-httpx.org/)

```py
import httpx
transport = httpx.HTTPTransport(retries=1)
client = httpx.Client(transport=transport, timeout=10.0)
```

Feel free to use this code for what you want but I do wish there was more user friendly ways to configure this as the retry amount and timeout defaults is something that is really good if your internet connection is unstable.
