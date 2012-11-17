// @jauhen

var Meme = Backbone.Model.extend({
	defaults: {
		image: 'empty.gif',
		date: (new Date),
		template: 'template1',
		author: 'me',
		messages: [{text: 'Hello World!', layout: 'top-center'}]
	},
	urlRoot: '/meme'
});

var Memes = Backbone.Collection.extend({
	model: Meme,
	url: '/memes'
});

var MemeView = Backbone.View.extend({
	tagName: 'div',
	className: 'meme',
	template: _.template($('#meme_template').html()),

	initialize: function () {
		this.render();
	},

	render: function() {
		this.$el.html(
			this.template({
				image: this.model.get('image')
			}));

		return this;
	},
});