// jauhen@

var Meme = Backbone.Model.extend({
//	defaults: {
//		src: 'empty.gif',
//		date: (new Date),
//		template: 'template1',
//		author: 'me',
//        timestamp: 0
//	},

    defaults: {
        id: null,
        blobKey: null,
        src: '',
        messages: {
            top: null,
            center: null,
            bottom: null
        }
    },
	urlRoot: 'http://epammeme.appspot.com/meme'
});

var Memes = Backbone.Collection.extend({
	model: Meme,
	url: 'http://epammeme.appspot.com/memes'
});

var MemeView = Backbone.View.extend({
    tagName: 'div',
    className: 'meme memeSmall',
    fontSize: 30,

    initialize: function () {
    },

    events: {
        'click' : 'onclick'
    },

    onclick: function(event) {
        // Go to meme only if meme creation dialog is inactive.
        if (!Create.onMemeClick(event, this)) {
            Backbone.history.navigate('http://epammeme.appspot.com/#meme/' + this.model.get('id'), true);
        }
    },

    positionMessages: function(fontSize) {
        fontSize = fontSize || this.fontSize;
        var parentWidth = this.$el.width();
        this.$('.message').map(function(i, el) {
            el = $(el);
            var width = el.width();
            if (parentWidth < width) {
                el.css('font-size', Math.floor(fontSize * (parentWidth - 20) / width));
            }
            el.width(parentWidth);
        });
    },

    createMessages: function() {
        var result = [];
        var messages = this.model.get('messages');
        for (var where in messages) {
            if (!messages[where]) continue;
            var messageEl = $('<div class="message"></div>');
            messageEl.addClass(where + '-center');
            // MemeDao has already escaped them, just to be sure.
            var text = messages[where].replace(/</g, '&lt;').replace(/>/g, '&gt;');
            var lines = text.split('\n');
            messageEl.html(lines.join('<br/>'));
            result.push(messageEl);
        }
        return result;
    },

    createImg: function() {
        var img = $('<img/>');
        // MemeDao must have not composed it with <>, just to be sure.
        var src = 'http://epammeme.appspot.com' + this.model.get('src');
        var src = src.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        img.attr('src', src);
        var text = _.values(this.model.get('messages')).join(' ');
        // MemeDao has already escaped them, just to be sure.
        text = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        img.attr('alt', text);
        img.attr('title', text);
        return img;
    },

    render: function(fontSize) {
        this.$el.empty();

        var messageEls = this.createMessages();

        var img = this.createImg();
        this.$el.hide();
        img.load($.proxy(function() {
            this.$el.show();
            this.positionMessages();
        }, this));

        this.$el.append(messageEls);
        this.$el.append(img);

        return this;
    },
});

//var MemeView = Backbone.View.extend({
//	tagName: 'div',
//	className: 'meme memeSmall',
//    fontSize: 30,
//	template: function(obj) {
//        var output = '<a href="http://epammeme.appspot.com/#meme/' + this.model.get('id') + '" target="_blank">';
//
//        _.each(obj.messages, function(message) {
//            output += '<div class="message ' + message.css + '">' + message.text + '</div>';
//        });
//
//        output += '<img src="http://epammeme.appspot.com/' + obj.image + '" alt="' + obj.text + '" title="' + obj.text + '"/>';
//        output += '<span>by ' + obj.author + '</span></a>';
//
//        return output;
//    },
//
//	initialize: function () {
//		this.render();
//	},
//
//    events: {
//        'click' : 'onclick'
//    },
//
//    onclick: function(event) {
//       Backbone.history.navigate('#meme/' + this.model.get('id'), true);
//    },
//
//	render: function() {
//
//		this.$el.html(
//			this.template({
//				image: this.model.get('src'),
//				text: _.map(this.model.get('messages'), function (el) {return el.text}).join(' '),
//				author: this.model.get('author'),
//				messages: this.model.get('messages')
//			}));
//
//		var element = this.$el;
//
//		$('img', element).load(function() {
//      $('div', element).map(function() {
//          var parentWidth = $(element).width() - 20;
//          $(this).css('display', 'block');
//          var width = $(this).width();
//          if (parentWidth < width) {
//              $(this).css('font-size', Math.floor(30 * (parentWidth - 20) / width));
//          }
//          $(this).width(parentWidth);
//      });
//    });
//
//		return this;
//	},
//});