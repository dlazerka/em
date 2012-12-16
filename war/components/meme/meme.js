/**
 * Vote model and views.
 *
 * @author jauhen@gmail.com (Jauhen Kutsuk)
 * @author Dima Lazerka
 */

var Meme = Backbone.Model.extend({
  defaults: {
    id: null,
    blobKey: null,
    src: '',
    animated: false,
    height: null,
    width: null,
    top: null,
    center: null,
    bottom: null,
    rating: 0
  },

  urlRoot: '/meme',

  vote: null,

  initialize: function() {
    this.vote = new Vote({
      id: this.id,
      rating: this.get('rating')
    });
    this.vote.on('change', function () {
      this.set('rating', this.vote.get('rating'));
    }, this);
  },

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

  getDesiredWidth: function() {
    var w = Number(this.model.get('width'));
    var h = Number(this.model.get('height'));
    if (!w || !h) return null; // width/height may be unset for just uploaded message which is not yel loaded by browser
    var dh = this.getDesiredHeight();
    return Math.round(w * dh / h); // proportional
  },

  getDesiredHeight: function() {
    if (this.className.indexOf('memeBig') == -1) {
      return 200;
    } else {
      return 500;
    }
  },

  /**
   * 1. If texts fits the image width, center-align.
   * 2. If message contains many spaces -- prevent browser from eating them to one,
   *   as specified by HTML. Users may align their messages by many spaces.
   * 3. If message doesn't fit the width, scale down, but not more than by 2 times.
   */
  positionMessages: function(fontSize) {
    fontSize = fontSize || this.fontSize;
    var desiredWidth = this.getDesiredWidth();
    if (!desiredWidth) return;
    var margin = 10;
    this.$('.message').each(function(i, messageEl) {
      messageEl = $(messageEl);
      // That would prevent line-breaking and space-eating .
      var html = messageEl.html();
      messageEl.html(html.replace(/ /g, '&nbsp;'));
      var fullWidth = messageEl.width();
      if (desiredWidth < fullWidth) {
        var ratio = (desiredWidth - 2*margin) / fullWidth;
        if (ratio < 0.5) {
          ratio = 0.5;
        }
        messageEl.css('zoom', ratio);
      }
      // Turn on line-breaks for the way too long messages.
      messageEl.html(html.replace(/  /g, ' &nbsp;'));
      messageEl.width('100%');
      messageEl.css('overflow', 'hidden');
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
      var lines = text.split('\n');
      messageEl.html(lines.join('<br/>'));
      result.push(messageEl);
    }
    return result;
  },

  createImg: function() {
    var img = $('<img class="img"/>');
    // MemeDao must have not composed it with <>, just to be sure.
    var src = this.model.get('src');
    var src = src.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    img.attr('src', src);
    if (this.getDesiredWidth()) {
      img.attr('width', this.getDesiredWidth());
      img.attr('height', this.getDesiredHeight());
    }
    var text = _.values(this.model.getMessagesMap()).join(' ').trim();
    // MemeDao has already escaped them, just to be sure.
    text = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    img.attr('alt', text);
    if (text) {
      img.attr('title', text);
    }
    return img;
  },

  render: function(fontSize) {
    this.$el.empty();
    var width = this.getDesiredWidth();
    var height = this.getDesiredHeight();

    var messageEls = this.createMessages();

    var img = this.createImg();

    if (this.model.get('animated') && this.className.indexOf('memeBig') == -1) {
      var canvas = $('<canvas class="canvas">');
      var videoIcon = $('<img src="img/video.svg" class="videoIcon" alt="video"/>')
      canvas.attr('width', width);
      canvas.attr('height', height);
      this.$el.mouseover(function () {
        canvas.hide();
        videoIcon.hide();
        img.show();
      });
      this.$el.mouseout(function () {
        var context = canvas[0].getContext('2d');
        context.drawImage(img[0], 0, 0, width, height);
        canvas.show();
        videoIcon.show();
        img.hide();
      });
    }

    this.$el.hide();
    img.load($.proxy(function() {
      if (canvas) {
        img.hide();
        var context = canvas[0].getContext('2d');
        context.drawImage(img[0], 0, 0, width, height);
      }
      this.$el.show();
      this.positionMessages();
    }, this));

    var voteView = new VoteView({model: this.model.vote});
    this.$el.append(img);
    if (canvas) {
      this.$el.append(canvas);
      this.$el.append(videoIcon);
    }
    this.$el.append(messageEls);
    this.$el.append(voteView.render().$el);

    return this;
  },
});
