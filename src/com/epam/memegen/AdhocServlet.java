package com.epam.memegen;

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
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;

public class AdhocServlet extends HttpServlet {
  private static final Logger logger = Logger.getLogger(AdhocServlet.class.getName());
  private BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
  private DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException,
      IOException {
    PreparedQuery pq = datastore.prepare(new Query("Meme"));
    List<Key> keys = new ArrayList<Key>();
    for (Entity entity : pq.asIterable()) {
      Key key = entity.getKey();
      if (key.getParent() != null) continue;
      keys.add(entity.getKey());
    }
    datastore.delete(keys);
    resp.setContentType("text/plain");
    resp.getWriter().append("" + keys.size());
  }
}
