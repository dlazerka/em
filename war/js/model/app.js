var AppRouter = Backbone.Router.extend({
  routes: {
    '': 'index',
    'memes': 'memes',
    'meme/:id': 'getMeme'
  },

  initialize: function() {
    var memes = new Memes(MEMES_JSON);
    this.onSuccessFeatchAll_(memes);
  },

  memes: function() {
    var memes = new Memes();
    memes.fetch({success: $.proxy(this.onSuccessFeatchAll_, this)});
  },

  getMeme: function(id) {
    var meme = new Meme({id: id});
    meme.fetch({success: $.proxy(this.onSuccessFeatch_, this)});
  },

  onSuccessFeatchAll_: function(memes) {
    $('#main_area').empty();
    for (var i = 0; i < memes.length; i++) {
      var memeView = new MemeView({model: memes.at(i), className: 'meme memeSmall'});
      $('#main_area').append(memeView.render().$el);
    }
  },

  onSuccessFeatch_: function(meme) {
    var memeView = new MemeView({model: meme, className: 'meme memeBig'});
    $('#main_area').html(memeView.render(50).$el);
    $('#main_area').append('<br/>');
    $('<button class="delete">Delete</button>').on('click', function() {
      meme.destroy({success: this.onSuccessDestroy_})
    }).appendTo($('#main_area'));
  },

  onSuccessDestroy_: function() {
    setTimeout(function() {
      Backbone.history.navigate('#memes', true);
    }, 1000);
  }  
});

$.ajaxSetup({cache: false});
new AppRouter();

// Trigger the initial route and enable HTML5 History API support
Backbone.history.start();
