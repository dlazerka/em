var ga = {};
var _gaq = _gaq || [];

(function() {

  function init() {
    _gaq.push(['_setAccount', 'UA-36410794-1']);
    (function() {
      var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
      ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
  }

  function trackPage(url) {
    _gaq.push(['_trackPageview', url]);
  }

  function trackLike(memeId, choice) {
    _gaq.push(['_trackEvent', choice == 1 ? 'Like' : 'Dislike', memeId.toString(), '', 1]);
  }

  function trackComment(memeId) {
    _gaq.push(['_trackEvent', 'Comment', memeId.toString(), '', 1]);
  }

  function trackCreate() {
    _gaq.push(['_trackEvent', 'Create', 'New Meme', '', 1]);
  }

  function trackInstallPlugin() {
    _gaq.push(['_trackEvent', 'Plugin install', '', '', 0]);
  }

  function trackError(msg) {
    _gaq.push(['_trackEvent', 'JS Error', msg, '', 0]);
  }

  window.ga.trackPage = trackPage;
  window.ga.trackLike = trackLike;
  window.ga.trackComment = trackComment;
  window.ga.trackCreate = trackCreate;
  window.ga.trackInstallPlugin = trackInstallPlugin;
  window.ga.trackError = trackError;
  
  init();
})();
