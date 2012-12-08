var Vote = Backbone.Model.extend({
  url: '/vote',

  like: function(choice) {
    ga.trackLike(this.id, choice);
    this.save({'choice': choice});
  }
});

var VoteView = Backbone.View.extend({
  tagName: 'div',
  className: 'vote',

  events: {
    'click .dislike': 'dislike',
    'click .like': 'like'
  },

  initialize: function() {
    this.model.on('change', this.render, this);
  },

  like: function() {
    this.model.like(1);
    return false;
  },

  dislike: function() {
    this.model.like(-1);
    return false;
  },

  render: function() {
    this.$el.html('<div class="like"/><div class="text">' + 
      this.model.get('rating') + '</div><div class="dislike"/>');
    return this;
  }
});