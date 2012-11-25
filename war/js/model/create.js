$(function() {
  Create.initialize();
});

var MemePreview = MemeView.extend({
  className: 'meme memePreview',

  initialize: function() {
  },

  events: {},

  render: function() {
    this.$el.empty();
    if (!this.model.get('src')) {
      this.$el.html('<div class="emptyImage"></div>');
    } else {
      this.$el.append(this.createMessages());
      this.$el.append(this.createImg());
    }
    $('#preview').html(this.$el);
  },
});


var Create = {
  initialize: function() {
    this.meme = new Meme();
    this.memeView = new MemePreview({model: this.meme});
    this.memeView.render();
    $('#topText,#centerText,#bottomText').keyup($.proxy(this.updateTexts, this));
  },

  /** @returns true if event was consumed */
  onMemeClick: function(event, memeView) {
    if ($('.upload').css('display') == 'none') {
      return false;
    }
    $('#uploadHelperText').hide();
    var src = memeView.model.get('src');
    var blobKey = memeView.model.get('blobKey');

    this.meme.set('src', src);
    this.meme.set('blobKey', blobKey);
    this.memeView.render();

    // Set width/height from clicked meme, because image is not drawn yet,
    // and we cannot assign "onload" event because the image is already in cache.
    var w = memeView.$('img').width();
    var h = memeView.$('img').height();
    var proportionalWidth = w * h / 200;
    var img = this.memeView.$('img');
    img.width(proportionalWidth);
    img.height(200);

    this.memeView.positionMessages(30);
    return true;
  },

  updateTexts: function() {
    var messages = [];
    if ($('#topText').val()) {
      messages.push({text: $('#topText').val(), css: 'top-center'});
    }
    if ($('#centerText').val()) {
      messages.push({text: $('#centerText').val(), css: 'center-center'});
    }
    if ($('#bottomText').val()) {
      messages.push({text: $('#bottomText').val(), css: 'bottom-center'});
    }
    if (messages.length) {
      this.meme.set('messages', messages);
    }
    this.memeView.$('.message').remove();
    var messageEls = this.memeView.createMessages();
    this.memeView.$el.append(messageEls);
    this.memeView.positionMessages(30);
  },
};