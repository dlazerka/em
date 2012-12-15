// Andrey Mormysh
var Comment = Backbone.Model.extend({
  defaults: {
    memeId: null,
    user: null,
    text: null,
    timestamp: null
  },

  url: '/comments'
});

var Comments = Backbone.Collection.extend({
  model: Comment,
  url: '/comments',
  addComment: function(memeId, text) {
    new this.model().save({'memeId': memeId, 'text': text});
  }
});

var CommentView = Backbone.View.extend({
  tagName: 'div',
  className: 'comment',

  /** @type {jQuery.promise} */
  template: null, 
  /** @type {Underscore.template} */
  compiledTemplate: null,

  initialize: function() {
    if(!this.template) { 
      CommentView.prototype.template = $.get('js/tmpl/comment.tpl');
    }
  },

  render: function() {
    this.$el.empty();

    // Done means that function will be runned when template is loaded.
    this.template.done(_.bind(function(tpl) {
      // Cache compiled template.
      if (!this.compiledTemplate) {
        CommentView.prototype.compiledTemplate = _.template(tpl);
      }
      this.$el.html(this.compiledTemplate(this.model.toJSON())) ; 
    }, this));

    return this;
  }
});

var CommentsView = Backbone.View.extend({
  tagName: 'div',
  className: 'comments',
  model: Comments,

  memeId: null,

  initialize: function() {
    this.memeId = this.options['memeId'];
  },

  render: function() {
    for (var i = 0; i < this.model.length; i++) {
      var commentView = new CommentView({model: this.model.at(i)});
      this.$el.append(commentView.render().$el);
    }
    var memeId = this.memeId;
    var model = this.model;
    var newComment = $('<textarea id="commentText" class="addCommentTextArea"></textarea>');
    var submitComment = $('<input type="button" class="addCommentButton" value="Add comment"/>');
    submitComment.on('click', function() {
      var newCommentTextArea = $('#commentText')[0];
      var text = newCommentTextArea.value;
      model.addComment(memeId, text);
      newCommentTextArea.value = "";
      submitComment.disabled = true;
        // todo: refresh just comments
      setTimeout(function() { window.location.reload(true) }, 1000);
    });

    this.$el.append(newComment);
    this.$el.append(submitComment);

    return this;
  }
});