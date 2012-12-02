$(function() {
  Create.initialize();
});

var MemePreview = MemeView.extend({
  className: 'meme memePreview',
  fontSize: 30,

  initialize: function() {
  },

  events: {},

  render: function() {
    this.$el.empty();
    if (!this.model.get('src')) {
      this.$el.html('<div class="emptyImage"></div>');
      $('#uploadHelperText').show();
      $('#top,#center,#bottom').val('');
    } else {
      this.$el.append(this.createMessages());
      this.$el.append(this.createImg());
      $('#uploadHelperText').hide();
    }
    $('#preview').html(this.$el);
  },
});

var Create = {
  initialize: function() {
    this.meme = new Meme();
    this.memeView = new MemePreview({model: this.meme});
    this.memeView.render();
    $('#top,#center,#bottom').keyup($.proxy(this.updateMessages, this));
    $('#uploadFile').change($.proxy(this.onFileFieldChange, this));
    $('#submit').click($.proxy(this.onSubmitClick, this));
  },

  /** @returns true if event was consumed */
  onMemeClick: function(event, memeView) {
    if ($('.upload').css('display') == 'none') {
      return false;
    }
    var src = memeView.model.get('src');
    var blobKey = memeView.model.get('blobKey');
    this.setImage(src, blobKey);

    // Set width/height from clicked meme, because image is not drawn yet,
    // and we cannot assign "onload" event because the image is already in cache.
    var w = memeView.$('img').width();
    var h = memeView.$('img').height();
    var proportionalWidth = w * 200 / h;
    var img = this.memeView.$('img');
    img.width(proportionalWidth);
    img.height(200);

    this.memeView.positionMessages();
    return true;
  },

  updateMessages: function() {
    var messages = this.meme.get('messages');
    this.meme.set('top', $('#top').val() || null);
    this.meme.set('center', $('#center').val() || null);
    this.meme.set('bottom', $('#bottom').val() || null);
    this.memeView.$('.message').remove();
    var messageEls = this.memeView.createMessages();
    this.memeView.$el.append(messageEls);
    this.memeView.positionMessages();
  },

  setImage: function(src, blobKey) {
    $('#uploadHelperText').hide();

    this.meme.set({'src': src, 'blobKey': blobKey});
    this.memeView.render();
    this.updateMessages();

    $('form [name="blobKey"]').val(blobKey);
  },

  /** @param event {ChangeEvent} */
  onFileFieldChange: function(event) {
    if (!XMLHttpRequestUpload) {
      alert('Your browser doesn\'t support XMLHttpRequestUpload. Try using a modern browser');
    }
    var element = event.target;
    if (!element.files || !element.files.length) {
      alert('Element doesn\'t contain files');
      return;
    }
    var formData = new FormData();
    formData.append('image', element.files[0]);

    var uploadUrl = $('#uploadUrl').val();
    var progressListener = this.onUploadProgessEvent;
    $.ajax({
        url: uploadUrl,
        data: formData,
        processData: false, // otherwise jquery throws TypeError
        contentType: false, // otherwise jquery will send wrong Content-Type
        type: 'POST',
        dataType: 'json',
        xhr: function() {
          var xhr = new XMLHttpRequest();
          xhr.upload.addEventListener("progress", progressListener, false);
          return xhr;
        },
    }).done($.proxy(this.onUploadDone, this));
  },

  onUploadDone: function(data) {
      // Set new upload URL so we can re-upload.
      $('#uploadUrl').val(data.newUploadUrl);
      Msg.info('Uploaded!', 1500);

      var src = data.uploads[0].src;
      var blobKey = data.uploads[0].blobKey;
      this.setImage(src, blobKey);
      var img = this.memeView.$('img');
      if (img[0].complete) {
        this.memeView.positionMessages();
      } else {
        img.load($.proxy(function() {
          this.memeView.positionMessages();
        }, this));
      }
  },

  onUploadProgessEvent: function(event) {
    var msg = 'Uploading...'
    if (event.lengthComputable) {
      var percent = Math.round(100 * event.loaded / event.total);
      msg += ' ' + percent + '%';
    }
    Msg.info(msg);
  },

  onSubmitClick: function() {
    Msg.info('Saving...');
    $('#submit').prop('disabled', true);
    var meme = this.meme.clone();
    var attrs = {};
    var options = {
        success: $.proxy(this.onSaved, this),
        error: $.proxy(this.onError, this)
    };
    meme.save(attrs, options);
  },

  onSaved: function(model, resp) {
    AppRouter.onMemeAdded(model);
    Msg.info('Saved!', 1500);
    $('#submit').prop('disabled', false);
    this.meme.set(this.meme.defaults, {silent: true});
    this.memeView.render();
  },

  onError: function(originalModel, resp, options) {
    if (_.isString(resp)) {
      // Validation error.
      msg = resp;
    } else {
      var msg = resp.statusText;
      try {
        msg = JSON.parse(resp.responseText).message;
      } catch (e) {
        window.console.log(e);
      }
    }
    Msg.error('Error: ' + msg);
    $('#submit').prop('disabled', false);
    this.meme.set(this.meme.defaults);
    this.memeView.render();
  }

};
