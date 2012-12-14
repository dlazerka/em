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

  render: function() {
    this.$el.empty();

    var user = this.model.get('user');
    var text = this.model.get('text');
    var timestamp = this.model.get('timestamp');

    this.$el.html("" +
        "<img src='img/avatar.jpg' class='avatar'/>" +
        "<div class='rightSide'><div><span class='user'>" + user + "</span>" +
        "<span class='timestamp'>" + new Date(timestamp).toString('') + "</span></div>" +
        "<span class='text'>" + text + "</span></div>"
    );

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