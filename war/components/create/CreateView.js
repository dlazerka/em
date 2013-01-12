var CreateView = Backbone.View.extend({
  el: '#create',
  memeView: new MemePreview({model: new Meme()}),
  /** @type {$.promise} */
  uploadUrl: null,

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
      this.template = $.get('/components/create/create.tpl');
    }
    this.$el.hide();
    this.render();
  },

  reset: function() {
    $('#submit').prop('disabled', false);
    this.memeView.model = new Meme();
    this.memeView.render();
  },

  toggle: function() {
    this.reset();
    this.$el.toggle();
  },

  render: function() {
    this.template.done(_.bind(function(tpl) {
      this.$el.append(_.template(tpl));
    }, this));

    return this;
  },

  /** @returns {boolean} Whether event was consumed */
  onMemeClick: function(event, memeView) {
    if ($('#create').css('display') == 'none' ||
        !this.template ||
        !$(this.$el).children().size()) {
      return false;
    }
    this.memeView.model = new Meme({
      blobKey: memeView.model.get('blobKey'),
      src: memeView.model.get('src'),
      animated: memeView.model.get('animated'),
      height: memeView.model.get('height'),
      width: memeView.model.get('width')
    });

    this.setImage();
    return true;
  },

  updateMessage: function() {
    var meme = this.memeView.model;
    var messages = meme.get('messages');
    meme.set('top', $('#top').val() || null);
    meme.set('center', $('#center').val() || null);
    meme.set('bottom', $('#bottom').val() || null);
    this.memeView.render();
  },

  onUploadLinkClick: function(event) {
    $('#uploadFile').click();
    this.uploadUrl = $.get('/upload');
    event.preventDefault();
    return false;
  },

  onFileFieldChange: function(event) {
    if (!window['XMLHttpRequestUpload']) {
      alert('Your browser doesn\'t support XMLHttpRequestUpload. Try using a modern browser');
      return;
    }
    var element = event.target;
    if (!element.files || !element.files.length) {
      alert('Element doesn\'t contain files');
      return;
    }
    var formData = new FormData();
    formData.append('image', element.files[0]);

    var progressListener = this.onUploadProgressEvent;
    this.uploadUrl.done(_.bind(function(url) {
      $.ajax({
        url: url,
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
    }, this));
  },

  onImageUploadComplete: function() {
    var img = $('img', this.$el);
    this.memeView.model.set('width', img.width());
    this.memeView.model.set('height', img.height());
  },

  onUploadDone: function(data) {
    Msg.info('Uploaded!', 1500);

    this.memeView.model.set({
      src: data.uploads[0].src,
      blobKey: data.uploads[0].blobKey});

    this.setImage();

    var img = this.memeView.$('img');
    if (img[0].complete) {
      this.onImageUploadComplete();
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
    var meme = this.memeView.model.clone();
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
    this.reset();
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
    this.reset();
  },

  setImage: function() {
    $('#uploadHelperText').hide();
    this.memeView.render();
  }
});
