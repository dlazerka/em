/** @author jauhen@gmail.com (Jauhen Kutsuk) */
var Vote = Backbone.Model.extend({
  url: '/vote',

  like: function(choice) {
    ga.trackLike(this.id, choice);
    this.save({'choice': choice});
  }
});
