---
layout: post
title: Syntax highlighted code pictures from the command line
date: 2023-12-11 05:36
image: /images/23-12-11_05-10-05.png 
tags:
- shell
---
There are times when you want to post pictures of code as the place to post them might not have a way to post code with syntax highlighting internally. What you typically will do in this case is screenshot code and then post that but the downside of that is that it is hard to fully automate. What we can do in this case is using a tool such as [pygments](https://pygments.org/) which supports outputting syntax highlighted code as images, HTML and even IRC color codes.

At first I thought about solving this an other way using some kind of command line syntax highlighter like bat then parsing the color codes which is something I might try too but it would require some special handling for long lines and such when trying to make it into an image but that I might try later as I still have not solved some text length issues I have been having with my crossposter.

Here is a script made for syntax highlighting and putting the images in a specific folder named by date. 

`pygi`
```sh
#!/bin/zsh
filename="pygimages/"$(date +'%y-%m-%d_%H-%M-%S')".png"
filepath=~/www/"$filename"
pygmentize -f img -O font_size=20 -O line_number_bg="#000" -O line_number_fg="#fff" -O hl_color="#000" -O image_pad=10 -P style=vice -o "$filepath" "$@"
if [ -f "$filepath" ]; then
  echo "$filepath";
fi
```

The color scheme is changed a bit here using the `pygments-vice` package that is a theme for pygments and a bunch of parameters are also changed to make the whole picture in a dark theme as it will chose a light theme by default with a white background but that is not what we want at all.

Here is some example code that has been highlighted using the script and the quality of it is very good and quite readable. where you can see stuff like variables, literals, comments, expressions and keywords have their own color.

[![
import re
#
def multiple_replace(replacements, text):
    # Create a regular expression from the dictionary keys
    regex = re.compile("(%s)" % "|".join(re.escape(a) for a in replacements), re.I)
    # For each match, look-up corresponding value in dictionary
    return regex.sub(lambda mo: replacements[mo.group().lower()], text)
#
if __name__ == "__main__":
    s = "larry wall is the creator of perl"
    d = {
        "larry wall": "Guido van Rossum",
        "creator": "Benevolent Dictator for Life",
        "perl": "Python",
    }
    print(multiple_replace(d, s))
](/images/23-12-11_05-10-05.png)](/images/23-12-11_05-10-05.png)

There are a few downsides of this that if you take a file with very long lines it will generate a very wide picture for example I took a long json lines files and it generated a PNG with the resolution 257648 x 1238
