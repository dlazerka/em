package com.epam.memegen;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.jsp.ah.datastoreViewerBody_jsp;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.gson.stream.JsonWriter;

@SuppressWarnings("serial")
public class MemeServlet extends HttpServlet {
  public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    resp.setContentType("application/json");
    resp.setCharacterEncoding("UTF-8");

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
      JsonWriter w = new JsonWriter(resp.getWriter());
      w.setIndent("  ");
      Util.memeToJson(entity, w);
    } catch (EntityNotFoundException e) {
      resp.sendError(404);
    }
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
