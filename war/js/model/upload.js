var Upload = {};

$(function() {
  $('#uploadFile').change(Upload.onFileFieldChange);
});

/** @param event {XMLHttpRequestProgressEvent} */
Upload.onProgessEvent = function(event) {
  // TODO
};

/** @param event {ChangeEvent} */
Upload.onFileFieldChange = function(event) {
  if (!XMLHttpRequestUpload) {
    alert('Your browser doesn\'t support XMLHttpRequestUpload. Try using a modern browser');
  }
  var element = event.target;
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
    $('img#preview').attr('src', src);
    $('#uploadUrl').val(data.newUploadUrl);
    $('form [name="blobKey"]').val(blobKey);
    $('form [name="src"]').val(src);
  });
};

