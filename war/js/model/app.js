var AppRouterClass = Backbone.Router.extend({
  routes: {
    '': 'initialize',
    'memes': 'getMemes',
    'meme/:id': 'getMeme'
  },

  initialize: function() {
    var memes = new Memes(MEMES_JSON);
    this.onSuccessFetchAll_(memes);
  },

  getMemes: function() {
    var memes = new Memes();
    memes.fetch({success: $.proxy(this.onSuccessFetchAll_, this)});
  },

  getMeme: function(id) {
    var meme = new Meme({id: id});
    meme.fetch({success: $.proxy(this.onSuccessFetch_, this)});
  },

  onMemeAdded: function(meme) {
    var memeView = new MemeView({model: meme});
    $('#main_area').prepend(memeView.render().$el);
  },

  onSuccessFetchAll_: function(memes) {
    $('#main_area').empty();
    for (var i = 0; i < memes.length; i++) {
      var memeView = new MemeView({model: memes.at(i)});
      $('#main_area').append(memeView.render().$el);
    }
  },

  onSuccessFetch_: function(meme) {
    var memeView = new MemeView({model: meme, className: 'meme memeBig'});
    $('#main_area').html(memeView.render(50).$el);
    $('#main_area').append('<br/>');
    $('<button class="delete">Delete</button>').on('click', $.proxy(function() {
      meme.destroy({success: this.onSuccessDestroy_})
    }, this)).appendTo($('#main_area'));
  },

  onSuccessDestroy_: function() {
    Backbone.history.navigate('#memes', true);
  }
});

$.ajaxSetup({cache: false});
var AppRouter = new AppRouterClass();

// Trigger the initial route and enable HTML5 History API support
Backbone.history.start();
