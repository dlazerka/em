//fetchMemes();
go();

function go() {
//    var memes = new Memes();
//    for (var i = 0; i < 10; i++) {
//        memes.push(new Meme({
//            url: 'https://memegen.googleplex.com/memeimage?k=11637038',
//            messages: [
//                {text: 'This Meme', css: 'top-center'},
//                {text: 'Is Deprecated', css: 'bottom-center'}]
//        }));
//
//        memes.push(new Meme({
//            url: 'https://memegen.googleplex.com/memeimage?k=11567160',
//            messages: [
//                {text: 'HolidayS are comming!', css: 'bottom-center'}]
//        }));
//
//        memes.push(new Meme({
//            url: 'https://memegen.googleplex.com/memeimage?k=11485229',
//            messages: [
//                {text: 'Monogomous', css: 'top-center'},
//                {text: 'Menonymous', css: 'center-center'},
//                {text: 'Monogomous', css: 'bottom-center'}]
//        }));
//    }
//    for (var i = 0; i < 30; i++) {
//        console.log(memes.at(i));
//        var memeView = new MemeView({model: memes.at(i)});
//
//        $("#main_area").append(memeView.render().$el);
//    }
    var memes = new Memes();
    memes.fetch({success: function(m) {
        for (var i = 0; i < m.length; i++) {
            var memeView = new MemeView({model: m.at(i)});
            $('#main_area').append(memeView.render().$el);
        }
    }});
}



function fetchMemes() {
    var jsonfile = new XMLHttpRequest();
    jsonfile.open("GET", "http://epammeme.appspot.com/memes", true);
    jsonfile.onreadystatechange = function() {
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