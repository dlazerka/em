/**
 * @author amormysh@gmail.com (Andrey Mormysh)
 * @author jauhen@gmail.com (Jauhen Kutsuk)
 *
 * List of comments.
 */
var Comments = Backbone.Collection.extend({
  model: Comment,
  memeId: null,
  url: '/comment'
});
