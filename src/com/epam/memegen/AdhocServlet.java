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
import com.google.appengine.api.datastore.Transaction;
import com.google.appengine.api.datastore.TransactionOptions;
import com.google.appengine.api.images.Image;
import com.google.appengine.api.images.ImagesServiceFactory;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

public class AdhocServlet extends HttpServlet {
  private static final Logger logger = Logger.getLogger(AdhocServlet.class.getName());
  private BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
  private UserService userService = UserServiceFactory.getUserService();
  private DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
  private Key allKey = KeyFactory.createKey("Meme", "ALL");

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException,
      IOException {
    if (true) return;// done

    if (!userService.isUserLoggedIn() || !userService.getCurrentUser().getEmail().equals("dzmitry_lazerka@epam.com")) {
      resp.sendError(403);
      return;
    }

    Transaction txn = datastore.beginTransaction();
    PreparedQuery pq = datastore.prepare(txn, new Query("Meme", allKey));
//    List<Key> keys = new ArrayList<Key>();
    List<Entity> entities = new ArrayList<Entity>();
    int a = 0;
    for (Entity entity : pq.asIterable(FetchOptions.Builder.withChunkSize(100))) {
      BlobKey blobKey = (BlobKey) entity.getProperty("blobKey");
      byte[] imageData = blobstoreService.fetchData(blobKey, 0, BlobstoreService.MAX_BLOB_FETCH_SIZE - 1);
      Image image = ImagesServiceFactory.makeImage(imageData);
      boolean animated = isAnimated(imageData);
      entity.setProperty("width", image.getWidth());
      entity.setProperty("height", image.getHeight());
      entity.setProperty("animated", animated);
      if (animated) a++;
      entities.add(entity);
    }
    datastore.put(txn, entities);
    txn.commit();
    resp.setContentType("text/plain");
    resp.getWriter().append("\n" + entities.size());
    resp.getWriter().append("\na: " + a);
  }

  /** Determines if it's a GIF image and it has more than one frame. */
  private boolean isAnimated(byte[] bb) {
    if (bb.length < 10) return false;
    // GIF89a
    if (bb[0] != 0x47 ||
        bb[1] != 0x49 ||
        bb[2] != 0x46 ||
        bb[3] != 0x38 ||
        bb[4] != 0x39 ||
        bb[5] != 0x61
      ) {
      return false;
    }

    int frames = 0;
    for (int i = 0; i < bb.length - 11; i++) {
      if (bb[i] == 0 &&
          bb[i+1] == 0x21 &&
          bb[i+2] == -7 && // 0xF9
          bb[i+3] == 0x04 &&
          bb[i+8] == 0 &&
          bb[i+9] == 0x2C
          ) {
        if (++frames >= 2) {
          break;
        }
      }
    }

    if (frames >= 2) {
      return true;
    }

    return false;
  }
}
