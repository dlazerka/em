package com.epam.memegen;

import java.io.IOException;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.stream.JsonWriter;

@SuppressWarnings("serial")
public class MemeServlet extends HttpServlet {
  public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    resp.setContentType("application/json");
    resp.setCharacterEncoding("UTF-8");

    if (req.getPathInfo() == null) {
      resp.sendError(HttpServletResponse.SC_NOT_FOUND);
      return;
    }

    String idStr = req.getPathInfo().replaceAll("[^0-9]+", "");
    if (idStr.equals("")) {
      resp.sendError(HttpServletResponse.SC_NOT_FOUND);
      return;
    }
    long id = Long.valueOf(idStr);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    Key key = KeyFactory.createKey("Meme", id);
    Entity entity;
    try {
      entity = datastore.get(key);
      JsonWriter w = new JsonWriter(resp.getWriter());
      w.setIndent("  ");
      Util.memeToJson(entity, w);
    } catch (EntityNotFoundException e) {
      resp.sendError(HttpServletResponse.SC_NOT_FOUND);
    }
  }

  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException,
      IOException {
    String topText = req.getParameter("topText");
    String centerText = req.getParameter("centerText");
    String bottomText = req.getParameter("bottomText");
    String blobKey = req.getParameter("blobKey");

    if (Util.isNullOrEmpty(blobKey)) {
      resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "No 'blobKey' param");
      return;
    }

    UserService userService = UserServiceFactory.getUserService();
    User user = userService.getCurrentUser();
    String email = user.getEmail();

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    Entity entity = new Entity("Meme");
    entity.setProperty("blobKey", new BlobKey(blobKey));
    entity.setProperty("authorEmail", email);
    entity.setProperty("date", new Date());
    if (!Util.isNullOrEmpty(topText)) {
      entity.setProperty("topText", topText);
    }
    if (!Util.isNullOrEmpty(centerText)) {
      entity.setProperty("centerText", centerText);
    }
    if (!Util.isNullOrEmpty(bottomText)) {
      entity.setProperty("bottomText", bottomText);
    }

    datastore.put(entity);

    resp.setStatus(HttpServletResponse.SC_OK);
    resp.sendRedirect("/");
  }

  @Override
  protected void doDelete(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    String idStr = req.getPathInfo().replaceAll("[^0-9]+", "");
    if (idStr.equals("")) {
      resp.sendError(404);
      return;
    }
    long id = Long.valueOf(idStr);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    Key key = KeyFactory.createKey("Meme", id);
    Entity entity;
    try {
      entity = datastore.get(key);
    } catch (EntityNotFoundException e) {
      resp.sendError(404, "No such meme");
      return;
    }
    entity.setProperty("deleted", true);
    datastore.put(entity);
    resp.setStatus(200);
  }


}
