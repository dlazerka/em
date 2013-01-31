/**
 * @author amormysh@gmail.com (Andrey Mormysh)
 * @author jauhen@gmail.com (Jauhen Kutsuk)
 *
 * Single comment view.
 */
var CommentView = Backbone.View.extend({
  tagName: 'div',
  className: 'comment',

  initialize: function() {
    var author = this.model.get('author');
    author = author.toLowerCase();
    this.model.set('author', author);
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  template: _.template(
    '<img src="/img/avatar.jpg" class="avatar">' +
    '  <div class="rightSide">' +
    '  <span class="author"><%=author%></span>' +
    '  <span class="timestamp"><%=(new Date(timestamp)).toLocaleDateString()%>,' + 
    '    <%=(new Date(timestamp)).toLocaleTimeString()%></span>' +
    '  <div class="text"><%-text%></div>' +
    '</div>'
  ),
});
