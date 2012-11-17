// jauhen@

var Meme = Backbone.Model.extend({
	defaults: {
		src: 'empty.gif',
		date: (new Date),
		template: 'template1',
		author: 'me',
		messages: [{text: '', css: 'top-center'}]
	},
	urlRoot: '/meme'
});

var Memes = Backbone.Collection.extend({
	model: Meme,
	url: '/memes'
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
				image: this.model.get('src'),
				text: _.map(this.model.get('messages'), function (el) {return el.text}).join(' '),
				author: this.model.get('author'),
				messages: this.model.get('messages')
			}));

		var element = this.$el;

		$('img', element).load(function() {
      $('div', element).map(function() {
        var width = $(this).width();
        var parentWidht = $(element).width() - 20;
        if (parentWidht < width) {
        	$(this).css('font-size', Math.floor(30 * parentWidht / width));
        } else {
        	$(this).width(parentWidht);
        }
      });
    });

		return this;
	},
});