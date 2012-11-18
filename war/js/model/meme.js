// jauhen@

var Meme = Backbone.Model.extend({
	defaults: {
		src: 'empty.gif',
		date: (new Date),
		template: 'template1',
		author: 'me',
		messages: [{text: '', css: 'top-center'}],
		font: 'Impact'
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
	template: function(obj) {
    var output = '';

    _.each(obj.messages, function(message) {
        output += '<div class="message ' + message.css + '">' + message.text + '</div>';
    });

    output += '<img src="' + obj.image + '" alt="' + obj.text + '" title="' + obj.text + '"/>';
    output += '<span>by ' + obj.author + '</span>';

    return output;
  },

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
        $(this).css('display': 'block');
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