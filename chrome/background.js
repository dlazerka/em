const URL = 'http://epammeme.appspot.com/';
//const URL = 'http://localhost:8888/';
const URL_STATS = URL + 'memes/stats';
function getMemes() {
  var lastSeen = Number(localStorage.getItem('lastSeen')) || 0;
  $.ajax({
    method: 'GET',
    url: URL_STATS,
    data: {'since': lastSeen},
    processData: true,
    dataType: 'json',
  })
  .success(function(data, textStatus, jqXhr) {
    if (data.reset) {
      localStorage.removeItem('lastSeen');
      chrome.browserAction.setBadgeText({text: ''});
      return;
    }
    var count = Number(data.count) || '';
    chrome.browserAction.setBadgeText({text: '' + count});
  });
}

setInterval(getMemes, 60000);

chrome.browserAction.onClicked.addListener(function(tab) {
  localStorage.setItem('lastSeen', new Date().getTime());
  chrome.browserAction.setBadgeText({text: ''});
  chrome.tabs.create({
    url: URL,
  });
});
