// jauhen@

var Meme = Backbone.Model.extend({
	defaults: {
		url: 'empty.gif',
		date: (new Date),
		template: 'template1',
		author: 'me',
		messages: [{text: 'Hello World!', css: 'top-center'}]
	},
	urlRoot: '/meme'
});

var Memes = Backbone.Collection.extend({
	model: Meme,
	url: 'memes'
});

var MemeView = Backbone.View.extend({
	tagName: 'span',
	className: 'meme',
	template: _.template($('#meme_template').html()),

	initialize: function () {
		this.render();
	},

	render: function() {
		this.$el.html(
			this.template({
				image: this.model.get('url'),
				text: _.map(this.model.get('messages'), function (el) {return el.text}).join(' '),
				author: this.model.get('author'),
				messages: this.model.get('messages')
			}));

		return this;
	},
});