var AppRouter = Backbone.Router.extend({
  routes: {
    '': 'index',
    'meme/:id': 'getMeme'
  },

  index: function() {
    var memes = new Memes();

    memes.fetch({success: function() {
      $('#main_area').empty();
      for (var i = 0; i < memes.length; i++) {
        var memeView = new MemeView({model: memes.at(i)});
        $('#main_area').append(memeView.render().$el);
      }
    }});
  },

  getMeme: function(id) {
    var meme = new Meme({id: id});

    meme.fetch({success: function() {
      var memeView = new MemeView({model: meme, className: 'meme memeBig', fontSize: 40});
      $('#main_area').html(memeView.render().$el);
      $('#main_area').append('<br/>');
      $('<button class="delete">Delete</button>').on('click', function() {
        meme.destroy({success: function() {
          setTimeout(function() {
            Backbone.history.navigate('', true);
          }, 500);
        }})
      }).appendTo($('#main_area'));
    }});
  }
});

$.ajaxSetup({ cache: false });
var app_router = new AppRouter;

// Trigger the initial route and enable HTML5 History API support
Backbone.history.start();
