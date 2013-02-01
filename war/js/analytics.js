var _gaq = _gaq || [];
window.ga = {
  init: function() {
    _gaq.push(['_setAccount', 'UA-36410794-1']);
    (function() {
      var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
      ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
  },

  trackPage: function(url) {
    _gaq.push(['_trackPageview', url]);
  },

  trackLike: function(memeId, choice) {
    _gaq.push(['_trackEvent', choice == 1 ? 'Like' : 'Dislike', memeId.toString(), '', 1]);
  },

  trackComment: function(memeId) {
    _gaq.push(['_trackEvent', 'Comment', memeId.toString(), '', 1]);
  },

  trackCreate: function() {
    _gaq.push(['_trackEvent', 'Create', 'New Meme', '', 1]);
  },

  trackInstallPlugin: function() {
    _gaq.push(['_trackEvent', 'Plugin install', '', '', 0]);
  },

  trackError: function(msg) {
    _gaq.push(['_trackEvent', 'JS Error', msg, '', 0]);
  },
}
window.ga.init();