// jauhen@

var Meme = Backbone.Model.extend({
  defaults: {
    id: 0,
    blobKey: null,
    src: '',
    date: (new Date),
    template: 'template1',
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
  tagName: 'div',
  className: 'meme',
  fontSize: 30,

  initialize: function () {
  },

  events: {
    'click' : 'onclick' 
  },

  onclick: function(event) {
    // Go to meme only if meme creation dialog is inactive.
    if (!Create.onMemeClick(event, this)) {
      Backbone.history.navigate('#meme/' + this.model.get('id'), true);
    }
  },

  positionMessages: function(fontSize) {
    var parentWidth = this.$el.width();
    var parentHeigth = this.$el.width();
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
    var messages = this.model.get('messages')
    for (var i = 0; i < messages.length; i++) {
      var message = messages[i];
      var messageEl = $('<div class="message"></div>');
      messageEl.addClass(message.css);
      if (message.text.length > 15) {
        messageEl.addClass('long');
      }
      messageEl.text(message.text);
      result.push(messageEl);
    }
    return result;
  },

  createImg: function() {
    var text = _.map(this.model.get('messages'), function (el) {return el.text}).join(' ');
    var img = $('<img/>');
    img.attr('src', this.model.get('src'));
    img.attr('alt', text);
    img.attr('title', text);
    return img;
  },

  render: function(fontSize) {
    this.$el.empty();

    fontSize = fontSize || this.fontSize;
    var messageEls = this.createMessages(fontSize);

    var img = this.createImg();
    this.$el.hide();
    img.load($.proxy(function() {
      this.$el.show();
      this.positionMessages(fontSize);
    }, this));

    this.$el.append(messageEls);
    this.$el.append(img);


    return this;
  },
});