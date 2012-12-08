package com.epam.memegen;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;

public class AdhocServlet extends HttpServlet {
  private static final Logger logger = Logger.getLogger(AdhocServlet.class.getName());
  private BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
  private DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
  private Key allKey = KeyFactory.createKey("Meme", "ALL");

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException,
      IOException {

    byte[] bb = new byte[156224];
//    byte[] bb = new byte[1000];
//    String[] ss = new String[156224];
    FileInputStream fis = new FileInputStream("template-gangnam.gif");
    fis.read(bb, 0, 3000);

    StringBuilder sb = new StringBuilder(156224 * 2);
    String s;
    for (int i = 0; i < bb.length ; i++ ) {
      byte b = bb[i];

      s = Integer.toHexString(b > 0 ? b : (b & 0x7F | 0x80)).toUpperCase();
      if (s.length() < 2) {
        sb.append('0');
      }
      sb.append(s).append('_');
    }
    if (true) return;

    PreparedQuery pq = datastore.prepare(new Query("Meme", allKey));
//    List<Key> keys = new ArrayList<Key>();
    List<Entity> entities = new ArrayList<Entity>();
    int wereNull = 0;
    int wereTrue = 0;
    int wereFalse = 0;
    for (Entity entity : pq.asIterable(FetchOptions.Builder.withChunkSize(100))) {
      Boolean deleted = (Boolean) entity.getProperty("deleted");
      if (deleted == null) {
        wereNull++;
        entity.setProperty("deleted", false);
      } else {
        if (deleted) wereTrue++;
        else wereFalse++;
      }
      entities.add(entity);
    }
    datastore.put(entities);
    resp.setContentType("text/plain");
    resp.getWriter().append("\n" + entities.size());
    resp.getWriter().append("\n wereNull: " + wereNull);
    resp.getWriter().append("\n wereTrue: " + wereTrue);
    resp.getWriter().append("\n wereFalse: " + wereFalse);
  }
}
