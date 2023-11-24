function mastodon_modal(hide = false) {
    var mast_modal_elem = document.getElementById("mastodon_modal")
    if (hide || mast_modal_elem.open) {
        mast_modal_elem.close()
    } else {
        mast_modal_elem.show()
    }
    mastodon_share()
}

function mastodon_share() {
    var inst_e = document.getElementById("mast_inst")
    var inst = inst_e.value
    if (inst.length === 0) {
        inst = "toot.cat"
    }
    if (inst.search(/https?/) !== 0) {
        inst = "https://" + inst
    }
    if (inst.substr(inst.length - 1) === "/") {
        inst = inst.substr(0, inst.length - 1)
    }
    var share = document.getElementById("mastodon_share")
    share.href = `${inst}/share?text=${encodeURIComponent(mastsharetext)}`
}

var load_disqus = function () {
    var d = document, s = d.createElement('script');
    s.src = 'https://ellietheyeen.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
};

var load_mastodon = function () {
    var info = document.getElementById("mastsinfobox");
    info.textContent = "Loading comments"
    fetch("https://gist.githubusercontent.com/EllieTheYeen/d83b14c225c8233e9c458f9d3889442b/raw/posts.csv")
        .then(async (d) => {
            var t = await d.text()
            var thisarticle = null;
            var lines = t.split("\n");
            for (var i = 0; i < lines.length; i++) {
                var a = lines[i].split(",")
                if (a[1] === thisid) {
                    thisarticle = a[0];
                    console.log(thisarticle)
                }
            }
            if (thisarticle === null) {
                info.textContent = "Sorry we could not find the post. It might not have been posted yet"
                return
            }
            var a = document.createElement("a");
            a.href = `https://toot.cat/@DPSsys/${thisarticle}`;
            a.target = "_blank"
            a.text = "Reply to this post to add a comment"
            document.getElementById("mastcomenurl").appendChild(a)
            await fetch(`https://toot.cat/api/v1/statuses/${thisarticle}/context`)
                .then((d) => d.json())
                .then((j) => {
                    if (!j.descentants) {
                        info.textContent = "No comments"
                    }
                    var elem = document.getElementById("mastcomments");
                    var i = 0;
                    for (var a of j.descendants) {
                        var comm = document.createElement("div")
                        elem.appendChild(comm)
                        comm.classList.add("mastcomment")
                        var useri = document.createElement("div")
                        comm.appendChild(useri)
                        useri.classList.add("userinfo")
                        var pfp = document.createElement("img")
                        useri.appendChild(pfp)
                        pfp.src = a.account.avatar
                        pfp.width = 100
                        pfp.height = 100
                        var name = document.createElement("div")
                        useri.appendChild(name)
                        var uurl = document.createElement("a")
                        name.appendChild(uurl)
                        uurl.target = "_blank"
                        uurl.href = a.url;
                        uurl.textContent = `${a.account.display_name} (${a.account.username})`;
                        var texte = document.createElement("div")
                        comm.appendChild(texte)
                        texte.classList.add("mastcommenttext")
                        texte.innerHTML = a.content
                        i++;
                    }
                    info.textContent = `${i} comments`
                })
        })
        .catch((e) => info.textContent = e)
};
