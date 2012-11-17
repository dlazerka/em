package com.epam.memegen;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.datastore.Blob;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;

@SuppressWarnings("serial")
public class ImageServlet extends HttpServlet {
  public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    resp.setContentType("image/jpeg");

    String pathInfo = req.getPathInfo();
    pathInfo = pathInfo.substring(1); // remove /
    pathInfo  = pathInfo.replaceFirst("/.*$", "");
    String idStr = pathInfo.replaceAll("[^0-9]+", "");
    if (idStr.equals("")) {
      resp.sendError(404);
      return;
    }
    long id = Long.valueOf(idStr);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    Key key = KeyFactory.createKey("Image", id);
    Entity entity;
    try {
      entity = datastore.get(key);
      Blob blob = (Blob) entity.getProperty("blob");
      resp.getOutputStream().write(blob.getBytes());
    } catch (EntityNotFoundException e) {
      resp.sendError(404);
    }
  }
}