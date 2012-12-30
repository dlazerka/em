var AppRouter = Backbone.Router.extend({
  memes: new Memes(MEMES_JSON),
  memesListEl: $('#memesList'),
  comments: new Comments(),
  createView: new CreateView(),

  routes: {
    '': 'start',
    'popular': 'popular',
    'all': 'all',
    'top': 'top',
    'meme/:id': 'showOneMeme'
  },

  initialize: function() {
    $('#showCreateDialog').click(_.bind(function() {
      this.createView.$el.toggle();
    }, this));

    // Make header ('<epam:memegen>') a link to the home
    $('#header').click(function() {
      Backbone.history.navigate('', true);
    });

    $('#prevPage').on('click', _.bind(this.prevPage, this));
    $('#nextPage').on('click', _.bind(this.nextPage, this));
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
    
    var memesPerPage = 50;
    var startPos = (memesPerPage * this.memes.page + 1);
    var endPos = (memesPerPage * this.memes.page + this.memes.length);
    $('#shownMemes').text(startPos + '-' + endPos);
    $('#prevPage').toggle(this.memes.page > 0);
    $('#nextPage').toggle(this.memes.length == memesPerPage);
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
