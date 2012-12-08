// jauhen@

var Meme = Backbone.Model.extend({
  defaults: {
    id: null,
    blobKey: null,
    src: '',
    top: null,
    center: null,
    bottom: null
  },

  urlRoot: '/meme',

  getMessagesMap: function() {
    return {
        'top': this.get('top'),
        'center': this.get('center'),
        'bottom': this.get('bottom')
    };
  },

  validate: function(attrs, options) {
    if (!attrs.blobKey) {
      return 'No image';
    }
  },
});

var Memes = Backbone.Collection.extend({
  model: Meme,
  url: '/memes'
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
      Backbone.history.navigate('#meme/' + this.model.get('id'), true);
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
    var messages = this.model.getMessagesMap();
    for (var where in messages) {
      if (!messages[where]) continue;
      var messageEl = $('<div class="message"></div>');
      messageEl.addClass(where + '-center');
      // MemeDao has already escaped them, just to be sure.
      var text = messages[where].replace(/</g, '&lt;').replace(/>/g, '&gt;');
      text = text.replace(/ /g, '&nbsp;');
      var lines = text.split('\n');
      messageEl.html(lines.join('<br/>'));
      result.push(messageEl);
    }
    return result;
  },

  createImg: function() {
    var img = $('<img/>');
    // MemeDao must have not composed it with <>, just to be sure.
    var src = this.model.get('src');
    var src = src.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    img.attr('src', src);
    var text = _.values(this.model.getMessagesMap()).join(' ');
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

    var vote = new Vote({id: this.model.id, choose: 5});
    var voteView = new VoteView({model: vote});
    this.$el.append(messageEls);
    this.$el.append(img);
    this.$el.append(voteView.render().$el);

    return this;
  },
});
