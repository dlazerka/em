var Meme = Backbone.Model.extend({
  defaults: {
    id: null,
    blobKey: null,
    src: '',
    animated: false,
    height: null,
    width: null,
    top: null,
    center: null,
    bottom: null,
    rating: 0
  },

  urlRoot: '/meme',

  vote: null,

  initialize: function() {
    this.vote = new Vote({
      id: this.id,// null if meme is not yet saved
      rating: this.get('rating')
    });
    this.vote.on('change', function () {
      this.set('rating', this.vote.get('rating'));
    }, this);

    // Update vote's ID when this meme is saved.
    this.bind('sync', _.bind(function() {
      this.vote.set('id', this.id)
    }, this));
  },

  getMessagesMap: function() {
    return {
        'top': this.get('top'),
        'center': this.get('center'),
        'bottom': this.get('bottom')
    };
  },

  validate: function(attrs, options) {
    if (!attrs.blobKey) {
      return 'No image';
    }
  }
});
