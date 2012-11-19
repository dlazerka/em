<%@ page import="com.google.appengine.api.blobstore.BlobstoreServiceFactory" %>
<%@ page import="com.google.appengine.api.blobstore.BlobstoreService" %>
<%
    BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
%>

<!DOCTYPE HTML>

<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <title>&lt;epam:memes&gt;</title>
    <link rel="stylesheet" type="text/css" href="css/main.css">
    <script type="text/javascript" src="js/lib/underscore.js"></script>
    <script type="text/javascript" src="js/lib/jquery.js"></script>
    <script type="text/javascript" src="js/lib/backbone.js"></script>
  </head>

  <body>
    <script>
      /** @param XMLHttpRequestProgressEvent*/
      function uploadProgress(event) {
        // TODO
      }
      function upload(element) {
        if (!XMLHttpRequestUpload) {
          alert('Your browser doesn\'t support XMLHttpRequestUpload. Try using a modern browser');
        }

        if (!element.files[0]) {
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
              xhr.upload.addEventListener("progress", uploadProgress, false);
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
      }
    </script>

  <h1 id="header">&lt;epam:<span>m</span><span>e</span><span>m</span><span>e</span><span>s</span>&gt;</h1>

    <div id="side_bar">
      <button onclick="$('.upload').toggle()">Отжечь</button>
      <br/>
      <br/>
      <a href="#">Свежачок</a>
    </div>

    <div class="upload" style="display: none;">
      <form action="/meme" method="POST">
          <input type="text" placeholder="Top text" name="topText"/>
          <br/>
          <input type="text" placeholder="Center text" name="centerText"/>
          <br/>
          <input type="text" placeholder="Bottom text" name="bottomText"/>
          <br/>
          <input type="hidden" name="blobKey"/>
          <input type="submit">
      </form>
      <input type="file" onchange="upload(this)">
      <input type="hidden" id="uploadUrl" value="<%= blobstoreService.createUploadUrl("/upload")%>">
      <br/>
      <img id="preview" class="meme preview"/>
      <div style="clear: both;"></div>
    </div>

    <div id="main_area"></div>

    <script type="text/javascript" src="js/model/meme.js"></script>
    <script type="text/javascript" src="js/model/app.js"></script>
    <script type="text/javascript">
      var _gaq = _gaq || [];
      _gaq.push(['_setAccount', 'UA-36410794-1']);
      _gaq.push(['_trackPageview']);
      (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
      })();
    </script>
  </body>
</html>