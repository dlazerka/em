chrome.browserAction.setBadgeText({text:''});
bg = chrome.extension.getBackgroundPage();

go();
function go() {
    var memes = new Memes();
    memes.fetch({
      success: onMemesSuccess,
      error: onMemesError
    });
}

function onMemesSuccess(m) {
  console.log("success");
  console.log(arguments);
  var max = bg.lastSeen || 0;
  var len = Math.min(5, m.length);
  for (var i = 0; i < len; i++) {
    ts = parseInt(m.at(i).get('timestamp'));
    if (ts > max) {
        max = ts;
    }
    var memeView = new MemeView({model:m.at(i)});
    $('#memesList').append(memeView.render().$el);
  }
  bg.lastSeen = max;
  localStorage.setItem("lastSeen", bg.lastSeen);
}

function onMemesError() {
  console.log("error");
  console.log(arguments);
  $('#memesList').append('<div><a href="http://epammeme.appspot.com" target="_blank" style="color: #0000cd; font-size: 16px">Login to track memes</a></div>');
}

