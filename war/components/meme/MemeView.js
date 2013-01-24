var MemeView = Backbone.View.extend({
  tagName: 'div',
  className: 'meme memeSmall',
  fontSize: 30,
  voteView: null,

  initialize: function () {
    this.voteView = new VoteView({model: this.model.vote});
  },

  events: {
    'click': 'onClick',
    'mouseover': 'onMouseOver',
    'mouseout': 'onMouseOut'
  },

  onClick: function(event) {
    event.preventDefault();// prevent <a> catching it.

    // Go to meme only if meme creation dialog is inactive.
    if (!AppRouter.createView.onMemeClick(event, this)) {
      Backbone.history.navigate('' + this.model.get('id'), true);
    }
  },

  onMouseOver: function() {
    if (this.$('.canvas').size()) {
      this.$('.canvas').hide();
      this.$('.videoIcon').hide();
      this.$('.img').show();
    }
  },

  onMouseOut: function() {
    if (this.$('.canvas').size()) {
      this.drawGifOnCanvas();
      this.$('.canvas').show();
      this.$('.videoIcon').show();
      this.$('.img').hide();
    }
  },

  drawGifOnCanvas: function() {
    var context = this.$('.canvas').get(0).getContext('2d');
    context.drawImage(this.$('.img').get(0), 0, 0, this.getDesiredWidth(), this.getDesiredHeight());
  },

  getDesiredWidth: function() {
    var w = Number(this.model.get('width'));
    var h = Number(this.model.get('height'));
    if (!w || !h) return ''; // width/height may be unset for just uploaded message which is not yel loaded by browser
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

  getMessageData: function() {
    var result = [];
    var messages = this.model.getMessagesMap();

    for (var where in messages) {
      if (!messages[where]) continue;

      // MemeDao has already escaped them, just to be sure.
      var text = messages[where].replace(/</g, '&lt;').replace(/>/g, '&gt;');
      var lines = text.split('\n');

      result.push({
        where: where,
        lines: lines.join('<br/>')
      });
    }

    return result;
  },

  getImageData: function() {
    return {
      id: this.model.get('id'), 
      src: this.model.get('src'), 
      height: this.getDesiredHeight(), 
      width: this.getDesiredWidth()
    };
  },

  mustDrawOnCanvas: function() {
    return this.model.get('animated') && this.className.indexOf('memeBig') == -1;
  },

  render: function() {
    this.$el.empty();

    var data = {
      image: this.getImageData(),
      messages: this.getMessageData(),
      canvas: null
    };

    if (this.mustDrawOnCanvas()) {
      data.canvas = {
        height: this.getDesiredHeight(),
        width: this.getDesiredWidth()
      };
    }

    this.$el.html(this.template(data));
    this.voteView.setElement(this.$('.vote')).render();
    
    if (this.mustDrawOnCanvas()) {
      this.$('.img').hide();
      // We should use direct binding because load event is not bubbled.
      this.$('.img').load(_.bind(function() {
        this.drawGifOnCanvas();
      }, this));
    }

    setTimeout(_.bind(this.positionMessages, this));

    return this;
  },

  /** @type {Underscore.template} */
  template: _.template(
    '<a href="<%=image.id%>">' +
    '<img class="img" src="<%=image.src%>" alt=""' +
    '  style="height: <%=image.height%>px; width: <%=image.width%>px;"/>' +
    '<% if (canvas) { %>' +
    '  <canvas class="canvas" height="<%=canvas.height%>" width="<%=canvas.width%>"></canvas>' +
    '  <img src="img/video.svg" class="videoIcon" alt="video"/>' +
    '<% } %>' +
    '<% _.each(messages, function(msg) { %>' +
    '  <div class="message <%=msg.where%>-center"><%=msg.lines%></div>' +
    '<% }); %>' +
    '</a>' +
    '<div class="vote"></div>'
  ),
});
