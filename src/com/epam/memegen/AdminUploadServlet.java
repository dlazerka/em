package com.epam.memegen;

import java.io.IOException;
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
import com.google.appengine.api.datastore.KeyFactory;

public class AdminUploadServlet extends HttpServlet {
  private static final Logger logger = Logger.getLogger(AdminUploadServlet.class.getName());
  private BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
  private DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException,
      IOException {
    Map<String, List<BlobKey>> blobs = blobstoreService.getUploads(req);
    List<BlobKey> blobKeys = blobs.get("image");
    BlobKey[] keys = blobKeys.toArray(new BlobKey[1]);

    if (blobKeys.isEmpty()) {
      resp.getWriter().write("blobKeys is empty");
    }

    String m = req.getParameter("m");
    if (m == null || m.equals("")) {
      blobstoreService.delete(keys);
    }

    for (BlobKey key : blobKeys) {
      logger.info(key.getKeyString());
      resp.getWriter().write(key.getKeyString());

      try {
        Entity entity = datastore.get(KeyFactory.createKey("Meme", Long.parseLong(m)));
        entity.setProperty("blobKey", key);
        datastore.put(entity);
        continue;
      } catch (NumberFormatException e) {
        logger.log(Level.SEVERE, e.getMessage());
        resp.getWriter().write(e.getMessage());
      } catch (EntityNotFoundException e) {
        logger.log(Level.WARNING, e.getMessage());
        resp.getWriter().write(e.getMessage());
      }
      blobstoreService.delete(keys);
      break;
    }
  }
}
