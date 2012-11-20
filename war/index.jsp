<%@ page contentType="text/html" pageEncoding="UTF-8"%>
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


  <h1 id="header">&lt;epam:<span>m</span><span>e</span><span>m</span><span>e</span><span>s</span>&gt;</h1>

    <div id="side_bar">
      <button id="showCreateDialog" onclick="$('.upload').toggle()">Отжечь</button>
      <br/>
      <br/>
      <a href="#">Свежачок</a>
    </div>

    <div class="upload" style="display: none;">
      <div>
        <input id="uploadFile" class="uploadFile" type="file">
        <input type="hidden" id="uploadUrl" value="<%= blobstoreService.createUploadUrl("/upload")%>">
        <br/>
        <img id="preview" class="preview"/>
      </div>
      <form action="/meme" method="POST">
          <textarea name="topText"></textarea>
          <br/>
          <textarea name="centerText"></textarea>
          <br/>
          <textarea name="bottomText"></textarea>
          <br/>
          <input type="hidden" name="blobKey"/>
          <input type="submit" value="Заслать">
      </form>
    </div>

    <div id="main_area"></div>

    <script type="text/javascript" src="js/model/meme.js"></script>
    <script type="text/javascript" src="js/model/app.js"></script>
    <script type="text/javascript" src="js/model/upload.js"></script>
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