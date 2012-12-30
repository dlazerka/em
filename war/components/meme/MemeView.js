var MemeView = Backbone.View.extend({
  tagName: 'div',
  className: 'meme memeSmall',
  fontSize: 30,

  /** @type {jQuery.promise} */
  template: null, 
  /** @type {Underscore.template} */
  compiledTemplate: null,

  initialize: function () {
    if (!MemeView.template) {
      MemeView.template = $.get('/components/meme/meme.tpl');
    }
    if(!this.template) {
      this.template = MemeView.template;
    }
  },

  events: {
    'click': 'onClick',
    'mouseover': 'onMouseOver',
    'mouseout': 'onMouseOut'
  },

  onClick: function(event) {
    // Go to meme only if meme creation dialog is inactive.
    if (!AppRouter.createView.onMemeClick(event, this)) {
      Backbone.history.navigate('#meme/' + this.model.get('id'), true);
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
      src: this.model.get('src'), 
      text: _.values(this.model.getMessagesMap()).join(' ').trim(), 
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

    var voteView = new VoteView({model: this.model.vote});

    this.template.done(_.bind(function(tpl) {
      // Cache compiled template.
      if (!this.compiledTemplate) {
        MemeView.prototype.compiledTemplate = _.template(tpl);
      }

      this.$el
          .html(this.compiledTemplate(data))
          .append(voteView.render().$el);
      this.positionMessages();

      if (this.mustDrawOnCanvas()) {
        this.$('.img').hide();
        // We should use direct binding because load event is not bubbled.
        this.$('.img').load(_.bind(function() {
          this.drawGifOnCanvas();
        }, this));
      }
    }, this));

    return this;
  }
});
