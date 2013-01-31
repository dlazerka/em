var Memes = Backbone.Collection.extend({
  model: Meme,
  url: '/memes',
  page: 0,
  filter: '',

  setFilter: function(newFilter) {
    if (newFilter != this.filter) {
      this.filter = newFilter;
      this.page = 0;
    }
  },

  getParams: function() {
    return {
      filter: this.filter,
      page: this.page
    }
  }

});
