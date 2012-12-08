var AppRouterClass = Backbone.Router.extend({
  memes: new Memes(MEMES_JSON),
  memesListEl: $('#memesList'),

  routes: {
    '': 'start',
    'meme/:id': 'showOneMeme'
  },

  initialize: function() {
    $('#delete').hide();
  },

  start: function() {
    this.showAllMemes_();
    $('#delete').hide();
  },

  getMemes: function() {
    this.memes = new Memes();
    this.memes.fetch({success: $.proxy(this.onSuccessFetchAll_, this)});
  },

  onMemeAdded: function(meme) {
    this.memes.unshift(meme);
    var memeView = new MemeView({model: meme});
    this.memesListEl.prepend(memeView.render().$el);
  },

  showOneMeme: function(id) {
    ga.trackPage('/meme/' + id);
    var meme = this.memes.get(id);
    var memeView = new MemeView({model: meme, className: 'meme memeBig'});
    this.memesListEl.html(memeView.render(50).$el);
    this.memesListEl.append('<br/>');
    var button = $('#delete');
    button.prop('disabled', false).show();
    button.on('click', $.proxy(function() {
      $('#delete').prop('disabled', true);
      Msg.info('Deleting...');
      meme.destroy({success: $.proxy(this.onSuccessDestroy_, this)})
    }, this))
  },

  showAllMemes_: function() {
    ga.trackPage();
    this.memesListEl.empty();
    for (var i = 0; i < this.memes.length; i++) {
      var memeView = new MemeView({model: this.memes.at(i)});
      this.memesListEl.append(memeView.render().$el);
    }
  },

  onSuccessDestroy_: function(model, resp) {
    Msg.info('Deleted!', 1500);
    this.memes.remove(model);
    Backbone.history.navigate('', true);
  }
});

$.ajaxSetup({cache: false});
var AppRouter = new AppRouterClass();

// Trigger the initial route and enable HTML5 History API support
Backbone.history.start();
