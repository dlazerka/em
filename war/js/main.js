window.Backbone = Backbone;
window.AppRouter = new AppRouter();

$.ajaxSetup({
  'cache': false,
  // doesn't actually work, because of backbone bug https://github.com/documentcloud/backbone/issues/1875
  'contentType': 'application/json; charset=UTF-8'
});

// Trigger the initial route and enable HTML5 History API support
Backbone.history.start({pushState: true});
