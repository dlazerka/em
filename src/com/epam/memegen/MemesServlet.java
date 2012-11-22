package com.epam.memegen;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Date;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheServiceFactory;
import com.google.gson.stream.JsonWriter;

@SuppressWarnings("serial")
public class MemesServlet extends HttpServlet {

  private MemcacheService cache = MemcacheServiceFactory.getMemcacheService();
  private DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

  public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    resp.setContentType("application/json");
    resp.setCharacterEncoding("UTF-8");
    resp.setHeader("X-Chrome-Exponential-Throttling", "disable");

    // Lookup memcache
    String key = req.getRequestURI();
    String cachedValue = (String)cache.get(key);
    if (cachedValue != null) {
      resp.getWriter().write(cachedValue);
      return;
    }
    // Cache missed

    Query q = new Query("Meme");
    q.addSort("date", SortDirection.DESCENDING);

    String since = req.getParameter("since");
    if (since != null) {
      Date date = new Date(Long.valueOf(since));
      q.setFilter(new FilterPredicate("date", FilterOperator.GREATER_THAN, date));
    }

    FetchOptions options = FetchOptions.Builder.withDefaults();
    String top = req.getParameter("top");
    if (top != null) {
      int t = Integer.parseInt(top);
      options.limit(t);
    }

    PreparedQuery prepared = datastore.prepare(q);
    Iterable<Entity> iterable = prepared.asIterable(options);

    StringWriter out = new StringWriter();
    JsonWriter w = new JsonWriter(new PrintWriter(out));
    w.setIndent("  ");
    w.beginArray();
    for (Entity entity : iterable) {
      if (entity.getProperty("deleted") != null) {
        continue;
      }
      Util.memeToJson(entity, w);
    }
    w.endArray();
    w.close();
    String value = out.toString();
    resp.getWriter().write(value);
    cache.put(key, value);
  }
}
