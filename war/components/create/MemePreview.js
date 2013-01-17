var MemePreview = MemeView.extend({
  className: 'meme memePreview',
  fontSize: 30,

  events: {},

  render: function() {
    this.$el.empty();
    var uploadHelperText = $('#uploadHelperText');
    if (this.model.get('src')) {
      var data = {
        image: this.getImageData(),
        messages: this.getMessageData(),
        canvas: null
      };
      this.$el.html(this.template(data));

      uploadHelperText.hide();
    } else {
      this.$el.html('<div class="emptyImage" />');
      uploadHelperText.show();
      $('#top,#center,#bottom').val('');
    }
    $('#preview').html(this.$el);
    this.positionMessages();
  }
});
