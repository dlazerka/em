var AppRouter = Backbone.Router.extend({
  memesByDateFirstPage: new Memes(ALL_MEMES),
  memesByRatingFirstPage: new Memes(TOP_MEMES),

  /**
   * Memes currently shown. New collection is assigned when top memes/page is changed.
   * @type Backbone.Collection 
   */
  memes: null,
  
  /**
   * Possible values: ['date', 'rating'].
   */
  sort: 'date',

  /**
   * Memes that should be shown when clicking Next.
   * @type jQuery.Promise
   */
  nextMemesPromise: null,
  /**
   * Memes that should be shown when clicking Prev.
   * @type jQuery.Promise
   */
  prevMemesPromise: null,
  page: 0,
  /** @type Array.<number> */
  deletedMemesIds: DELETED_MEMES_IDS,
  memesListEl: $('#memesList'),
  comments: new Comments(),
  createView: new CreateView(),

  routes: {
    '': 'showMemesByDate',
    'top': 'showMemesByRating',
    ':id': 'showOneMeme'
  },

  initialize: function() {
    $('#showCreateDialog').click(_.bind(function() {
      this.createView.toggle();
      $('#showCreateDialog').attr('disabled', 'true');
    }, this));

    // Make header ('<epam:memegen>') a link to the home
    $('#header').click(function() {
      Backbone.history.navigate('', true);
    });

    $('#navRecent').on('click', _.bind(this.onNavClick, this, '/'));
    $('#navTop').on('click', _.bind(this.onNavClick, this, '/top'));

    $('#prevPage').on('click', _.bind(this.prevPage, this));
    $('#nextPage').on('click', _.bind(this.nextPage, this));
  },

  onNavClick: function(path, event) {
    event.preventDefault();// prevent <a> catching it.
    this.navigate(path, true);
  },

  requestNextMemes: function() {
    var params = {
      page: this.page + 1,
      sort: this.sort,
    };
    this.nextMemesPromise = $.get('/memes', params);
    // There's one more .done() for this promise below.
    this.nextMemesPromise.done(function(result) {
      if (result.length == 0) {
        $('#nextPage').css('visibility', 'hidden');
      } else {
        $('#nextPage').css('visibility', '');
      }
    });
  },

  requestPrevMemes: function() {
    if (this.page == 0) {
      this.prevMemesPromise == null;
      $('#prevPage').css('visibility', 'hidden');
      return;
    } else {
      $('#prevPage').css('visibility', '');
    }
    var params = {
        page: this.page - 1,
        sort: this.sort,
      };
    this.prevMemesPromise = $.get('/memes', params);
  },

  getComments: function(memeId) {
    this.comments.memeId = memeId;
    this.comments.fetch({
      data: {id: memeId},
      success: _.bind(this.showComments, this)});
  },

  showComments: function() {
    this.memesListEl.append(new CommentsView({
      model: this.comments
    }).render().$el);
  },

  onMemeAdded: function(meme) {
    this.memesByDateFirstPage.unshift(meme);
    var memeView = new MemeView({model: meme});
    if (this.memes == this.memesByDateFirstPage) {
      this.memesListEl.prepend(memeView.render().$el);
    }
  },

  showOneMeme: function(id) {
    ga.trackPage('/' + id);
    $('#pagination').hide();

    var meme = null;
    if (this.memes) {// If clicked on the screen
       meme = this.memes.get(id);
    } else {
      meme = new Meme(MEME);
    }
    if (!meme) {
      var msg = _.contains(this.deletedMemesIds, Number(id)) ?
          'Meme is deleted' : 'Meme not found';
      this.memesListEl.html(msg);
      return;
    }
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

  reset: function() {
    this.page = 0;
    this.showMemes();
    $('#pagination').show();
    this.requestNextMemes();
    this.requestPrevMemes();
  },

  showMemesByDate: function() {
    this.sort = 'date';
    ga.trackPage('/');
    this.memes = this.memesByDateFirstPage;
    this.reset();
  },

  showMemesByRating: function() {
    this.sort = 'rating';
    ga.trackPage('/top');
    this.memes = this.memesByRatingFirstPage;
    this.reset();
  },

  showMemes: function() {
    this.memesListEl.empty();
    for (var i = 0; i < this.memes.length; i++) {
      var memeView = new MemeView({model: this.memes.at(i)});
      this.memesListEl.append(memeView.render().$el);
    }
    var startPos = (MEMES_PER_PAGE * this.memes.page + 1);
    var endPos = (MEMES_PER_PAGE * this.memes.page + this.memes.length);
  },

  onSuccessDestroy_: function(model, resp) {
    Msg.info('Deleted!', 1500);
    this.memes.remove(model);
    this.memesByDateFirstPage.remove(model);
    this.memesByRatingFirstPage.remove(model);
    this.deletedMemesIds.push(model.get('id'));
    Backbone.history.navigate('', true);
  },

  nextPage: function() {
    this.nextMemesPromise.done(_.bind(function(result) {
      if (result.length == 0) {
        // User should not be able to click, because Next must've been already hidden.
        return;
      }
      this.memes = new Memes(result);
      this.page++;
      this.showMemes();
      this.requestNextMemes();
      this.requestPrevMemes();
    }, this));
  },

  prevPage: function() {
    if (this.prevMemesPromise == null) {
      // User should not be able to click, because Prev must've been already hidden.
      return;
    }
    this.prevMemesPromise.done(_.bind(function(result) {
      this.memes = new Memes(result);
      if (this.page > 0) {
        this.page--;
        this.showMemes();
        this.requestPrevMemes();
        this.requestNextMemes();
      }
    }, this));
  }
});
