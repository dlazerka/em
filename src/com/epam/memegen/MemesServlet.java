package com.epam.memegen;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;

@SuppressWarnings("serial")
public class MemesServlet extends HttpServlet {
  public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    Query q = new Query("Meme");
    PreparedQuery prepared = datastore.prepare(q);
    Iterable<Entity> iterable = prepared.asIterable();

    resp.setContentType("application/json");

    PrintWriter writer = resp.getWriter();
    writer.append("[\n");
    boolean first = true;
    for (Entity entity : iterable) {
      if (first) {
        first = false;
      } else {
        writer.append(",\n");
      }

      String json = Util.memeToJson(entity);
      writer.write(json);
    }
    writer.append("\n]");
  }

}
