---
title: Getting the gist
date: 2010-12-10 17:11:15
tags:
  - gist
  - git
  - github
  - javascript
  - jquery
---
I really like [Gist](https://gist.github.com/), a lot. They are full on git repos and as such have version control, remote updating, all of the things you would expect out of a github repo including most of the social aspects. They also have the best syntax highlighting I have seen. Yes, there are other libs that do it in various languages, but I really like theirs and I like having my code in 1 place.

I've made several gists since I have become a member and expect that I will be making more now that I have gotten this down. The main complaint I have with gists is that to embed them in your blog you have to include a script tag that does a document.write. Aside from my misgivings about document.write, this poses a performance and user experience issue. Consider on a blog post with multiple snippets of code, the page stops loading until the scripts are downloaded and executed. Nevermind anything they may clobber during the process. And finally, I end up with a stylesheet in the DOM for each included gist that are all the exact same. So, I did:

{% gist 735512 %}

Ironically enough, I made a gist about it. As usual, it's using jQuery (cause that's my fav little DOM manip/XHR lib) and it's just a simple little plugin that looks for links to gists, parses out the gist id and file name (if provided), fetches the gist, and duck punches document.write to replace said link with the code and drop the css file into the head (only once). This is all after DOM ready, so the page will load up just fine, only applying these things after the fact.

So, I know what you are thinking "Whoa, whoa, whoa! Duck punching document.write?!" Honestly, I wish I could have avoided it. I tried various techniques to leave document.write alone but I just couldn't find another way to make it work. Eventually I decided this was the easiest way to do it. I really despise document.write, so I only feel partially guilty about this. That and this plugin was developed for my site. If I don't want you using document.write on my website, well, that's my prerogative. If you use this plugin, know that.

Feel free to update or give feedback.
