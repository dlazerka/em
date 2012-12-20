$(function() {
  Create.initialize();
});

var MemePreview = MemeView.extend({
  className: 'meme memePreview',
  fontSize: 30,

  initialize: function() {},

  events: {},

  render: function() {
    this.$el.empty();
    if (!this.model.get('src')) {
      this.$el.html('<div class="emptyImage"></div>');
      $('#uploadHelperText').show();
      $('#top,#center,#bottom').val('');
    } else {
      var data = {
        image: this.getImageData(),
        messages: this.getMessageData(),
        canvas: null
      };
      this.template.done(_.bind(function(tpl) {
        this.$el.html(this.compiledTemplate(data));
      }, this));
      $('#uploadHelperText').hide();
    }
    $('#preview').html(this.$el);
    this.positionMessages();
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
    $('#uploadLink').click(function(event) {
      $('#uploadFile').click();
      event.preventDefault();
      return false;
    });
  },

  /** @returns true if event was consumed */
  onMemeClick: function(event, memeView) {
    if ($('.upload').css('display') == 'none') {
      return false;
    }
    this.meme = memeView.model.clone();
    this.meme.unset('top');
    this.meme.unset('center');
    this.meme.unset('bottom');
    this.meme.unset('id');

    this.memeView.model = this.meme;

    this.setImage();
    return true;
  },

  updateMessages: function() {
    var messages = this.meme.get('messages');
    this.meme.set('top', $('#top').val() || null);
    this.meme.set('center', $('#center').val() || null);
    this.meme.set('bottom', $('#bottom').val() || null);
    this.memeView.render();
  },

  setImage: function() {
    $('#uploadHelperText').hide();
    this.memeView.render();
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
    })
    .done($.proxy(this.onUploadDone, this))
    .error($.proxy(this.onUploadError, this));
  },

  onUploadDone: function(data) {
    // Set new upload URL so we can re-upload.
    $('#uploadUrl').val(data.newUploadUrl);
    Msg.info('Uploaded!', 1500);

    this.meme.set({
      'src': data.uploads[0].src,
      'blobKey': data.uploads[0].blobKey});

    this.setImage();

    var img = this.memeView.$('img');
    function onComplete() {
      this.meme.set('width', img.width());
      this.meme.set('height', img.height());
    }
    if (img[0].complete) {
      onComplete();
    } else {
      img.load($.proxy(onComplete, this));
    }
  },

  onUploadError: function(jqXhr, status, message) {
    Msg.error('Error: ' + message);
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
        error: $.proxy(this.onError, this),
        contentType: 'application/json; charset=utf-8'
    };
    meme.save(attrs, options);
  },

  onSaved: function(model, resp) {
    AppRouter.onMemeAdded(model);
    Msg.info('Saved!', 1500);
    $('#submit').prop('disabled', false);
    $('.upload').hide();
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
