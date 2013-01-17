/** Renders vote component and handle like/dislike buttons clicks. */
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
    this.$el.html(this.template(this.model.toJSON())) ; 
    return this;
  },
  
  template: _.template(
    '<div class="like"/>' +
    '<div class="text"><%=rating%></div>' +
    '<div class="dislike"/>'
  ),
});
