/**
 * @author amormysh@gmail.com (Andrey Mormysh)
 * @author jauhen@gmail.com (Jauhen Kutsuk)
 */
/** Comment creation form. */
var CommentForm = Backbone.View.extend({
  /** @type {jQuery.promise} */
  template: null, 

  events: {
    'click .addCommentButton': 'addNew'
  },

  initialize: function() {
    if(!this.template) { 
      CommentForm.prototype.template = $.get('/components/comment/comment-form.tpl');
    }
  },

  addNew: function() {
    ga.trackComment(this.model.get('memeId'));
    var text = $('.addCommentTextArea', this.$el).val();
    this.model.save('text', text, {success: _.bind(function(model) {
      this.options.list.add(model);
    }, this)});
  },

  render: function() {
    // Done means that function will be runned when template is loaded.
    this.template.done(_.bind(function(tpl) {
      this.$el.append(tpl);
    }, this));

    return this;
  }
});
