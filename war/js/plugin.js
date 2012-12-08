(function($) {
  $.browser.chrome = /chrome/.test(navigator.userAgent.toLowerCase());

  function init() {
    setTimeout(function() {
      // Check if plugin is installed by searching for element with id "epam-memegen-extension-is-installed".
      // If not found - show button.
      if ($('#epam-memegen-extension-is-installed').size()) {
        console.log("EPAM memegen plugin is installed");
      } else {
        $('#epam-memegen-install-button').show();
      }
    }, 1000);
  }

  function installPlugin() {
    if ($.browser.chrome) {
      console.log("This is Chrome, proceeding with inline-install");
      installPluginChrome();
    } else {
      console.log("This is not Chrome, simply redirecting to Chrome Store's page of the plugin");
      window.location = PLUGIN_URL;
    }
  }

  function installPluginChrome() {
    // This works only in Chrome
    ga.trackInstallPlugin();
    chrome.webstore.install(
      PLUGIN_URL,
      function() {
        $('#epam-memegen-install-button').hide();
      },
      function(err) {
        console.log(err);
        ga.trackError(err);
      }
    )
  }

  $(function() {
    init();
    $('#epam-memegen-install-button').click(installPlugin);
  });
})(jQuery);
