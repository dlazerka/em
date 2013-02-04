// Adds element to HTML page so that it knows this extension is installed.
var ad = document.getElementById('extensionAd');
if (ad) {
  var div = document.createElement('div');
  div.id = 'extensionInstalled';
  ad.appendChild(div);
}
