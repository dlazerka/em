//fetchMemes();
chrome.browserAction.setBadgeText({text:''});
bg = chrome.extension.getBackgroundPage();

go();
function go() {
    var memes = new Memes();
    var max = bg.lastSeen || 0;
    memes.fetch({success:function (m) {
        for (var i = 0; i < m.length; i++) {
            ts = parseInt(m.at(i).get('timestamp'));
            if (ts > max) {
                max = ts;
            }
            var memeView = new MemeView({model:m.at(i)});
            $('#main_area').append(memeView.render().$el);
        }
        console.log("max=" + max);
        bg.lastSeen = max;
        localStorage.setItem("lastSeen", bg.lastSeen);
    }, data:{ top:5}, error:function () {
        $('#main_area').append('<div><a href="http://epammeme.appspot.com" target="_blank" style="color: #0000cd; font-size: 16px">Login to track memes</a></div>');
    }});
}


function fetchMemes() {
    var jsonfile = new XMLHttpRequest();
    jsonfile.open("GET", "http://epammeme.appspot.com/memes", true);
    jsonfile.onreadystatechange = function () {
        if (jsonfile.readyState == 4) {
            if (jsonfile.status == 200) {
                showMemes(JSON.parse(jsonfile.responseText));
            }
        }
    };
    jsonfile.send(null);
}

function showMemes(memeList) {
    for (var i = 0; i < memeList.length; i++) {
        var meme = memeList[i];
        var img = document.createElement("image");
        img.src = "http://epammeme.appspot.com" + meme.src;
        var div = document.createElement("div");
        div.appendChild(img);
        document.body.appendChild(div);
    }
}