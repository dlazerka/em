package com.epam.memegen;

import java.io.IOException;
import java.io.InputStream;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileItemStream;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.IOUtils;

import com.google.appengine.api.datastore.Blob;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;

@SuppressWarnings("serial")
public class UploadServlet extends HttpServlet {

  public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    ServletFileUpload u = new ServletFileUpload();
    u.setFileSizeMax(1 << 20 - 10000); // 1MiB - 10kB
    resp.setContentType("text/plain");
    resp.getWriter().println("Hello, world");

    try {
      FileItemIterator iterator = u.getItemIterator(req);
      while (iterator.hasNext()) {
        FileItemStream item = iterator.next();
        InputStream is = item.openStream();
        byte[] bytes = IOUtils.toByteArray(is);
        Blob blob = new Blob(bytes);
        String name = item.getName();

        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        Entity entity = new Entity("Image");
        entity.setUnindexedProperty("blob", blob);
        entity.setProperty("name", name);
        datastore.put(entity);
        Key key = entity.getKey();
        resp.sendRedirect(key.getId() + "");
      }
    } catch (FileUploadException e) {
      throw new IOException(e);
    }
  }
}
