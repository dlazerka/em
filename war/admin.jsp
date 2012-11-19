<%@ page import="com.google.appengine.api.blobstore.BlobstoreServiceFactory" %>
<%@ page import="com.google.appengine.api.blobstore.BlobstoreService" %>

<%
    BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
    String m = request.getParameter("m");
%>
<!DOCTYPE HTML>

<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <title>&lt;epam:memes&gt;</title>
    <link rel="stylesheet" type="text/css" href="css/main.css">
    <script type="text/javascript" src="js/lib/jquery.js"></script>
  </head>
  <script>
  </script>

  <body>

    <h1 id="header">&lt;epam:<span>m</span><span>e</span><span>m</span><span>e</span><span>s</span>&gt;</h1>
    
    <form action="<%= blobstoreService.createUploadUrl("/admin/upload?m=" + m) %>" method="post" enctype="multipart/form-data">
        <input type="file" name="image">
        <input type="text" value="<%=m%>">
        <input type="submit">
    </form>

  </body>
  
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
</html>