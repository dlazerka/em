var MemePreview = MemeView.extend({
  className: 'meme memePreview',
  fontSize: 30,

  initialize: function() {},

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
      this.template.done(_.bind(function () {
        this.$el.html(this.compiledTemplate(data));
      }, this));

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

var MemeCreateView = Backbone.View.extend({
  el: '#create',
  meme: null,
  uploadUrl: UPLOAD_URL,

  /** @type {$.promise} */
  template: null,
  /** @type {_.template} */
  compiledTemplate: null,

  events: {
    'keyup #top': 'updateMessage',
    'keyup #center': 'updateMessage',
    'keyup #bottom': 'updateMessage',
    'change #uploadFile': 'onFileFieldChange',
    'click #submit': 'onSubmitClick',
    'click #uploadLink': 'onUploadLinkClick'
  },

  initialize: function() {
    if(!this.template) {
      MemeCreateView.prototype.template = $.get('/components/meme/create.tpl');
    }
  },

  render: function() {
    this.meme = new Meme();
    this.memeView = new MemePreview({model: this.meme});

    this.template.done(_.bind(function(tpl) {
      this.$el.append(_.template(tpl, {uploadUrl: this.uploadUrl}));
    }, this));

    return this;
  },

  /** @returns {boolean} Whether event was consumed */
  onMemeClick: function(event, memeView) {
    if (!this.template || !$(this.$el).children().size()) {
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

  updateMessage: function() {
    var messages = this.meme.get('messages');
    this.meme.set('top', $('#top').val() || null);
    this.meme.set('center', $('#center').val() || null);
    this.meme.set('bottom', $('#bottom').val() || null);
    this.memeView.render();
  },

  onUploadLinkClick: function(event) {
    $('#uploadFile').click();
    event.preventDefault();
    return false;
  },

  onFileFieldChange: function(event) {
    if (!window['XMLHttpRequestUpload']) {
      alert('Your browser doesn\'t support XMLHttpRequestUpload. Try using a modern browser');
    }
    var element = event.target;
    if (!element.files || !element.files.length) {
      alert('Element doesn\'t contain files');
      return;
    }
    var formData = new FormData();
    formData.append('image', element.files[0]);

    var uploadUrl = $('#uploadUrl', this.$el).val();
    var progressListener = this.onUploadProgressEvent;
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
      }
    })
    .done(_.bind(this.onUploadDone, this))
    .error(_.bind(this.onUploadError, this));
  },

  onImageUploadComplete: function(img) {
    this.meme.set('width', img.width());
    this.meme.set('height', img.height());
  },

  onUploadDone: function(data) {
    // Set new upload URL so we can re-upload.
    this.uploadUrl = data.newUploadUrl;
    Msg.info('Uploaded!', 1500);

    this.meme.set({
      'src': data.uploads[0].src,
      'blobKey': data.uploads[0].blobKey});

    this.setImage();

    var img = this.memeView.$('img');
    if (img[0].complete) {
      this.onImageUploadComplete(img);
    } else {
      img.load(_.bind(this.onImageUploadComplete, this));
    }
  },

  onUploadError: function(jqXhr, status, message) {
    Msg.error('Error: ' + message);
  },

  onUploadProgressEvent: function(event) {
    var msg = 'Uploading...';
    if (event.lengthComputable) {
      var percent = Math.round(100 * event.loaded / event.total);
      msg += ' ' + percent + '%';
    }
    Msg.info(msg);
  },

  onSubmitClick: function() {
    Msg.info('Saving...');
    ga.trackCreate();
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

    this.$el.empty();
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
  },

  setImage: function() {
    $('#uploadHelperText').hide();
    this.memeView.render();
  }
});
