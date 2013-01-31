/**
 * @author amormysh@gmail.com (Andrey Mormysh)
 * @author jauhen@gmail.com (Jauhen Kutsuk)
 * 
 * List of comments view.
 */
var CommentsView = Backbone.View.extend({
  tagName: 'div',
  className: 'comments',

  initialize: function() {
    this.model.on('add', this.render, this);
  },

  render: function() {
    this.$el.empty();

    // Render list of comments.
    _.each(this.model.models, _.bind(function(model){
      var commentView = new CommentView({model: model});
      this.$el.append(commentView.render().$el);
    }, this));

    // Render comment creation form.
    var commentForm = new CommentForm({
      model: new Comment({memeId: this.model.memeId}),
      list: this.model
    });
    this.$el.append(commentForm.render().$el);

    return this;
  }
});
