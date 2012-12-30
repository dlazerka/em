var AppRouter = Backbone.Router.extend({
  allMemes: new Memes(ALL_MEMES_JSON),
  topMemes: new Memes(TOP_MEMES_JSON),
  memesListEl: $('#memesList'),
  comments: new Comments(),
  createView: new CreateView(),

  routes: {
    '': 'showAllMemes',
    'top': 'showTopMemes',
    'meme/:id': 'showOneMeme'
  },

  initialize: function() {
    $('#showCreateDialog').click(_.bind(function() {
      this.createView.toggle();
    }, this));

    // Make header ('<epam:memegen>') a link to the home
    $('#header').click(function() {
      Backbone.history.navigate('', true);
    });

    $('#prevPage').on('click', _.bind(this.prevPage, this));
    $('#nextPage').on('click', _.bind(this.nextPage, this));
  },

  getComments: function(memeId) {
    this.comments.memeId = memeId;
    this.comments.fetch({
      data: {id: memeId},
      success: _.bind(this.showComments, this)});
  },

  onMemeAdded: function(meme) {
    this.allMemes.unshift(meme);
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
    var meme = this.allMemes.get(id);
    var memeView = new MemeView({model: meme, className: 'meme memeBig'});
    this.memesListEl.html(memeView.render(50).$el);
    this.memesListEl.append('<br/>');
    var button = $('#delete');
    button.on('click', $.proxy(function() {
      Msg.info('Deleting...');
      meme.destroy({success: $.proxy(this.onSuccessDestroy_, this)})
    }, this));
    this.getComments(id);
    $('#pagination').hide();
  },

  showAllMemes: function() {
    ga.trackPage();
    this.showMemes(this.allMemes);
  },

  showTopMemes: function() {
    ga.trackPage('/top');
    this.showMemes(this.topMemes);
  },

  showMemes: function(memes) {
    this.memesListEl.empty();
    for (var i = 0; i < memes.length; i++) {
      var memeView = new MemeView({model: memes.at(i)});
      this.memesListEl.append(memeView.render().$el);
    }
    
    var memesPerPage = 50;
    var startPos = (memesPerPage * memes.page + 1);
    var endPos = (memesPerPage * memes.page + memes.length);
    $('#pagination').show();
    $('#shownMemes').text(startPos + '-' + endPos);
    $('#prevPage').toggle(memes.page > 0);
    $('#nextPage').toggle(memes.length == memesPerPage);
  },

  onSuccessDestroy_: function(model, resp) {
    Msg.info('Deleted!', 1500);
    this.allMemes.remove(model);
    this.topMemes.remove(model);
    Backbone.history.navigate('', true);
  },

  nextPage: function() {
    ++thithis.allMemesge;
    this.allMemes.fetch({
      data: this.allMemes.getParams(),
      success: _.bind(this.start, this)});
  },

  prevPage: function() {
    if (this.allMemes.page > 0) {
      --this.allMemes.page;
      this.allMemes.fetch({
        data: this.allMemes.getParams(),
        success: _.bind(this.start, this)});
    }
  }
});
