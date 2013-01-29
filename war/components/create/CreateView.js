var CreateView = Backbone.View.extend({
  el: '#create',
  memeView: new MemePreview({model: new Meme()}),
  /** @type {$.promise} */
  uploadUrl: null,

  lastDownloadedUrl: null,

  events: {
    'keyup #top': 'updateMessage',
    'keyup #center': 'updateMessage',
    'keyup #bottom': 'updateMessage',
    'change #uploadFile': 'onFileFieldChange',
    'click #submit': 'onSubmitClick',
    'click #cancel': 'onCancelClick',
    'click #uploadLink': 'onUploadLinkClick',
    'keyup #remoteImageUrl': 'onRemoteUrlFieldChange',
  },

  initialize: function() {
    this.$el.hide();
    this.render();
  },

  reset: function() {
    $('#remoteImageUrl').val('');
    $('#submit').prop('disabled', false);
    this.memeView.model = new Meme();
    this.memeView.render();
  },

  toggle: function() {
    this.reset();
    this.$el.toggle();
  },

  onCancelClick: function() {
    this.toggle();
    $('#showCreateDialog').attr('disabled', null);
  },

  render: function() {
    this.$el.append(this.template());
    return this;
  },

  /** @returns {boolean} Whether event was consumed */
  onMemeClick: function(event, memeView) {
    if ($('#create').css('display') == 'none' ||
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

  /**
   * Calls server that will download image by user-provided URL.
   * Server will return blobKey and image src.
   */
  onRemoteUrlFieldChange: function(event) {
    var url = $('#remoteImageUrl').val() || '';
    url = url.trim();
    if (!url || url == this.lastDownloadedUrl) return;
    this.lastDownloadedUrl = url;
    $.ajax({
      url: '/download',
      data: {'url': url},
      type: 'GET',
      dataType: 'json',
    })
    .done(_.bind(this.onUploadDone, this))
    .error(_.bind(this.onAjaxError, this))
    .complete(function() {
      $('#remoteImageUrl').attr('disabled', null);
    });
    $('#remoteImageUrl').attr('disabled', 'true');
    Msg.info('Downloading...');
  },

  /**
   * Uploads the file by AJAX, showing progress by messages.
   * When uploaded, show the image using url from server.
   * We could optimize a bit and show image even before it's uploaded to server
   * (using FileReader readAsDataURL), but it's not worth it.
   */
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
      .error(_.bind(this.onAjaxError, this));
    }, this));
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

  onImageUploadComplete: function() {
    var img = this.$('img');
    this.memeView.model.set('width', img.width());
    this.memeView.model.set('height', img.height());
  },

  setImage: function() {
    $('#uploadHelperText').hide();
    this.memeView.render();
  },

  onAjaxError: function(jqXhr, status, message) {
    var json = jqXhr.responseText;
    try {
      message = JSON.parse(json).message;
    } catch (e) {
      // Let message be message.
    }
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
      success: $.proxy(this.onMemeSaved, this),
      error: $.proxy(this.onMemeSaveError, this),
      contentType: 'application/json; charset=utf-8'
    };
    meme.save(attrs, options);
  },

  onMemeSaved: function(model, resp) {
    AppRouter.onMemeAdded(model);
    Msg.info('Saved!', 1500);
    this.reset();
  },

  onMemeSaveError: function(originalModel, resp, options) {
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

  template: _.template(
    '<div class="imageWithUpload">' +
    '  <div id="preview" class="preview"></div>' +
    '  <div id="uploadHelperText" class="uploadHelperText">' +
    '    <a id="uploadLink" href="#">Upload</a> new image,<br/>' +
    '    or enter <input type="text" id="remoteImageUrl" class="remoteImageUrl" placeholder=" remote image URL"><br/>' +
    '    or click on any meme.' +
    '  </div>' +
    '  <input id="uploadFile" class="uploadFile" type="file">' +
    '  <br/>' +
    '</div>' +
    '<div class="form">' +
    '  <textarea id="top"></textarea>' +
    '  <br/>' +
    '  <textarea id="center"></textarea>' +
    '  <br/>' +
    '  <textarea id="bottom"></textarea>' +
    '  <br/>' +
    '  <input type="hidden" name="blobKey"/>' +
    '  <button id="submit">Submit</button>' +
    '  <button id="cancel">Cancel</button>' +
    '</div>' +
    '<div class="clear"></div>'
  ),
});
