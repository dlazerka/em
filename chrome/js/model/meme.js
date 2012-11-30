// jauhen@

var Meme = Backbone.Model.extend({
	defaults: {
		src: 'empty.gif',
		date: (new Date),
		template: 'template1',
		author: 'me',
        timestamp: 0
	},
	urlRoot: '/meme'
});

var Memes = Backbone.Collection.extend({
	model: Meme,
	url: 'http://epammeme.appspot.com/memes'
});

var MemeView = Backbone.View.extend({
	tagName: 'span',
	className: 'meme',
	template: function(obj) {
        var output = '<a href="http://epammeme.appspot.com/#meme/' + this.model.get('id') + '" target="_blank">';

        _.each(obj.messages, function(message) {
            output += '<div class="message ' + message.css + '">' + message.text + '</div>';
        });

        output += '<img src="http://epammeme.appspot.com/' + obj.image + '" alt="' + obj.text + '" title="' + obj.text + '"/>';
        output += '<span>by ' + obj.author + '</span></a>';

        return output;
    },

	initialize: function () {
		this.render();
	},

    events: {
        'click' : 'onclick'
    },

    onclick: function(event) {
       Backbone.history.navigate('#meme/' + this.model.get('id'), true);
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
          var parentWidth = $(element).width() - 20;
          $(this).css('display', 'block');
          var width = $(this).width();
          if (parentWidth < width) {
              $(this).css('font-size', Math.floor(30 * (parentWidth - 20) / width));
          }
          $(this).width(parentWidth);
      });
    });

		return this;
	},
});