---
layout: post
date:   2023-10-31 01:22:41 +0200
title:  Previewing of 3D models on GitHub
tags:
- github
- jekyll
- gist
---
Was trying to figure out how to actually preview 3D models on GitHub and found out a few things.

* 
{:toc}

## Non code files
Github has a way of allowing certain files to be previewed in fancy ways even in Gists for filetypes that are not technically code <https://docs.github.com/en/repositories/working-with-files/using-files/working-with-non-code-files> and you can also use this to preview files from GitHub on your own website using their embedder.

These can be things that are sort of code like Jupyter notebooks to things that are not at all code such as 3D models or even things such as maps or PDF documents or CSV/TSV.

The capability of previewing 3D models is what I am the most interested in in case I would publish some models for use in VRChat or other games where people can see them in a fancy way beforehand in the browser before they download them.

## Limitations
The only 3D model file you can upload is a STL file. The STL file can either be of the ascii or binary type.  
There is a certain annoyance when it comes to uploading binary STL files to Gists and that is that the API does not seem to want them being uploaded as they are not considered text. Other files that are not STL will not show a preview like OBJ or FBX so you cannot have your textured 3D models there unfortunate unless there is another way to do that that I am not familiar with.

If you just have an ascii STL file you can just drag and drop it onto the gist window at `https://gist.github.com/`

### Example of the binary STL workaround using Gist cloning
Did you know you can clone a gist?
Let's say we have the following link after uploading the Gist using the rubygem gist tool or the GitHub CLI tool or just on the web  
<https://gist.github.com/EllieTheYeen/fe1db023f985d2da7dae820e3e8fe8b0>  
Now what we want to do is to clone it using a command such as
`git clone https://gist.github.com/EllieTheYeen/fe1db023f985d2da7dae820e3e8fe8b0`  
or if you want to use SSH then run this instead  
`git clone git@gist.github.com:fe1db023f985d2da7dae820e3e8fe8b0.git`  
now enter the directory and run something like
`git rm gistfile1.txt`  
or what the text file is called and add the STL file to the directory and run `git add filename.stl` and then do `git commit` and `git push` assuming you have a key that works or you are able to write to that Gist.
Now visit the URL of that gist again and your STL will be there previewable

## The actual preview
As you should be able to see below here is a 3D model that you can click on and rotate and you should be able to press raw to download it if you are interested in it. It is a towel holder I made for 3D printing that works quite well and can also be used to hold bags of for example chips closed.

{% gist fe1db023f985d2da7dae820e3e8fe8b0 %}

The syntax to preview any Gist here on GitHub pages in a markdown document is  
`{% raw %}{% gist fe1db023f985d2da7dae820e3e8fe8b0 %}{% endraw %}`  
Where the hex string is what you get from the URL of a Gist.
The downside of this is that this method will only work on GitHub pages and now in a md file on github.com
