/** Renders vote component and handle like/dislike buttons clicks. */
var VoteView = Backbone.View.extend({
  /** @type {jQuery.promise} */
  template: null, 
  /** @type {Underscore.template} */
  compiledTemplate: null,

  events: {
    'click .dislike': 'dislike',
    'click .like': 'like'
  },

  initialize: function() {
    this.model.on('change', this.render, this);
    if(!this.template) { 
      VoteView.prototype.template = $.get('/components/vote/vote.tpl');
    }
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
    // Done means that function will be runned when template is loaded.
    this.template.done(_.bind(function(tpl) {
      // Cache compiled template.
      if (!this.compiledTemplate) {
        VoteView.prototype.compiledTemplate = _.template(tpl);
      }
      this.$el.html(this.compiledTemplate(this.model.toJSON())) ; 
    }, this));

    return this;
  }
});
