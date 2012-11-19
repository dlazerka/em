// Called when a message is passed.  We assume that the content script
// wants to show the page action.
function onRequest(request, sender, sendResponse) {
    // Show the page action for the tab that the sender (content script)
    // was on.
    chrome.pageAction.show(sender.tab.id);

    // Return nothing to let the connection be cleaned up.
    sendResponse({});
}
;

// Listen for the content script to send a message to the background page.
chrome.extension.onRequest.addListener(onRequest);

var fetchFreq = 60000;
var lastSeen = localStorage.getItem("lastSeen") || 0;
console.log("lastSeen=" + lastSeen);

getMemes();
setInterval(getMemes, fetchFreq);

function getMemes() {
    var memes = new Memes();
    memes.fetch({success:function (m) {
        var badgeText = '';
        if (m.length > 0) {
            badgeText = '' + m.length;
        }
        chrome.browserAction.setBadgeText({text:badgeText});
//        for (var i = 0; i < m.length; i++) {
//            ts = parseInt(m.at(i).get('timestamp'));
//            console.log(ts);
//        }
    }, data: { since: lastSeen}});
}