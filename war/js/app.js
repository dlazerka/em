window.Backbone = Backbone;

var AppRouterClass = Backbone.Router.extend({
  memes: new Memes(MEMES_JSON),
  memesListEl: $('#memesList'),
  comments: new Comments(),
  createMemeView: new MemeCreateView(),

  routes: {
    '': 'start',
    'popular': 'popular',
    'all': 'all',
    'top': 'top',
    'meme/:id': 'showOneMeme'
  },

  initialize: function() {
    $('#showCreateDialog').click(_.bind(function() {
      this.createMemeView.render();
    }, this));

    $('#delete').hide();
    // Make header ('<epam:memegen>') a link to the home
    $('#header').click(function() {
      Backbone.history.navigate('', true);
    });

    this.memesListEl.on('click', '#prev', _.bind(this.prevPage, this));
    this.memesListEl.on('click', '#next', _.bind(this.nextPage, this));
  },

  start: function() {
    ga.trackPage();
    this.showAllMemes_();
  },

  all: function() {
    ga.trackPage('/all');
    this.memes.setFilter('all');
    this.memes.fetch({
      data: this.memes.getParams(),
      success: _.bind(this.start, this)});
  },

  popular: function() {
    ga.trackPage('/popular');
    this.memes.setFilter('popular');
    this.memes.fetch({
      data: this.memes.getParams(),
      success: _.bind(this.start, this)});
  },

  top: function() {
    ga.trackPage('/top');
    this.memes.setFilter('top');
    this.memes.fetch({
      data: this.memes.getParams(),
      success: _.bind(this.start, this)});
  },

  getComments: function(memeId) {
    this.comments.memeId = memeId;
    this.comments.fetch({
      data: {id: memeId},
      success: _.bind(this.showComments, this)});
  },

  onMemeAdded: function(meme) {
    this.memes.unshift(meme);
    var memeView = new MemeView({model: meme});
    this.memesListEl.prepend(memeView.render().$el);
  },

  showComments: function() {
    this.memesListEl.append(new CommentsView({
      model: this.comments
    }).render().$el);
  },

  showOneMeme: function(id) {
    ga.trackPage('/meme/' + id);
    var meme = this.memes.get(id);
    var memeView = new MemeView({model: meme, className: 'meme memeBig'});
    this.memesListEl.html(memeView.render(50).$el);
    this.memesListEl.append('<br/>');
    var button = $('#delete');
    button.on('click', $.proxy(function() {
      $('#delete').prop('disabled', true);
      Msg.info('Deleting...');
      meme.destroy({success: $.proxy(this.onSuccessDestroy_, this)})
    }, this));
    this.getComments(id);
  },

  showAllMemes_: function() {
    this.memesListEl.empty();
    for (var i = 0; i < this.memes.length; i++) {
      var memeView = new MemeView({model: this.memes.at(i)});
      this.memesListEl.append(memeView.render().$el);
    }

    var paging = this.memesListEl.append('<div id="pagination">').children('#pagination');
    paging.append('Shown ' + (50 * this.memes.page + 1) + '-' + (50 * this.memes.page + this.memes.length));
    if (this.memes.page > 0) {
      paging.append('<span id="prev">Prev 50</span>');
    }

    if (this.memes.length == 50) {
      paging.append('<span id="next">Next 50</span>');
    }
  },

  onSuccessDestroy_: function(model, resp) {
    Msg.info('Deleted!', 1500);
    this.memes.remove(model);
    Backbone.history.navigate('', true);
  },

  nextPage: function() {
    ++this.memes.page;
    this.memes.fetch({
      data: this.memes.getParams(),
      success: _.bind(this.start, this)});
  },

  prevPage: function() {
    if (this.memes.page > 0) {
      --this.memes.page;
      this.memes.fetch({
        data: this.memes.getParams(),
        success: _.bind(this.start, this)});
    }
  }
});

$.ajaxSetup({
  'cache': false,
  // doesn't actually work, because of backbone bug https://github.com/documentcloud/backbone/issues/1875
  'contentType': 'application/json; charset=UTF-8'
});


var AppRouter = new AppRouterClass();
if (IS_AUTHENTICATED === false) {
  ga.trackNoAuth();
}

// Trigger the initial route and enable HTML5 History API support
Backbone.history.start();
