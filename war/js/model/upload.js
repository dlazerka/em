var Upload = {};

$(function() {
  $('#uploadFile').change(Upload.onFileFieldChange);
//  $('#preview').bind('drop', Upload.onFileDrop);
//  $('#preview')[0].addEventListener('drop', Upload.onFileDrop, true);
});

/** @param event {XMLHttpRequestProgressEvent} */
Upload.onProgessEvent = function(event) {
  // TODO
};

/** @returns true if event was consumed */
Upload.onMemeClick = function(event, meme) {
  if ($('.upload').css('display') == 'none') {
    return false;
  }
  var src = meme.model.get('src')
  var blobKey = meme.model.get('blobKey');
  Upload.setPreview_(src, blobKey);
  return true;
};

/** @param event {ChangeEvent} */
Upload.onFileFieldChange = function(event) {
  if (!XMLHttpRequestUpload) {
    alert('Your browser doesn\'t support XMLHttpRequestUpload. Try using a modern browser');
  }
  var element = $('#uploadFile')[0];
  if (!element.files || !element.files.length) {
    alert('Element doesn\'t contain files');
  }
  var formData = new FormData();
  formData.append('image', element.files[0]);

  var uploadUrl = $('#uploadUrl').val();
  $.ajax({
      url: uploadUrl,
      data: formData,
      processData: false, // otherwise jquery throws TypeError
      contentType: false, // otherwise jquery will send wrong Content-Type
      type: 'POST',
      dataType: 'json',
      xhr: function() {
        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", Upload.onProgessEvent, false);
        return xhr;
      },
  }).done(function(data) {
    var src = data.uploads[0].src;
    var blobKey = data.uploads[0].blobKey;

    Upload.setPreview_(src, blobKey);
    $('#uploadUrl').val(data.newUploadUrl);// doesn't work currently
  });
};

Upload.setPreview_ = function(src, blobKey) {
  $('#uploadHelperText').hide();
  $('#preview').attr('src', src);
  $('.preview').css('min-width', '1px');
  $('form [name="blobKey"]').val(blobKey);
  $('#uploadCancel').show();
  Create.setPreview(src, blobKey);
};

Upload.onFileDrop = function (event) {
  event.stopPropagation(); // Stops some browsers from redirecting.
  event.preventDefault();

  var files = event.dataTransfer.files;
  for (var i = 0, f; f = files[i]; i++) {
    console.log(f);
    // Read the File objects in this FileList.
  }
}