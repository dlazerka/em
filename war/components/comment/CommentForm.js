/**
 * @author amormysh@gmail.com (Andrey Mormysh)
 * @author jauhen@gmail.com (Jauhen Kutsuk)
 */
/** Comment creation form. */
var CommentForm = Backbone.View.extend({
  events: {
    'click .addCommentButton': 'addNew'
  },

  addNew: function() {
    ga.trackComment(this.model.get('memeId'));
    var text = $('.addCommentTextArea', this.$el).val();
    this.model.save('text', text, {success: _.bind(function(model) {
      this.options.list.add(model);
    }, this)});
  },

  render: function() {
    this.$el.append(this.template());

    return this;
  },
  
  template: _.template(
    '<textarea class="addCommentTextArea" rows="2"></textarea>' +
    '<input type="button" class="addCommentButton" value="Add comment"/>'
  ),
});
