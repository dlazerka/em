/**
 * @author amormysh@gmail.com (Andrey Mormysh)
 * @author jauhen@gmail.com (Jauhen Kutsuk)
 */
var Comment = Backbone.Model.extend({
  defaults: {
    memeId: null,
    author: null,
    text: null,
    timestamp: null
  },

  url: '/comment'
});
