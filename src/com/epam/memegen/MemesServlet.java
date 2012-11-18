package com.epam.memegen;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.CompositeFilter;
import com.google.appengine.api.datastore.Query.CompositeFilterOperator;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.gson.stream.JsonWriter;

@SuppressWarnings("serial")
public class MemesServlet extends HttpServlet {
  public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    Query q = new Query("Meme");
    q.addSort("date", SortDirection.DESCENDING);

    List<Filter> filters = new ArrayList<Filter>();

    String since  = req.getParameter("since");
    if (since != null) {
      Date date = new Date(Long.valueOf(since));
//      filters.add(new FilterPredicate("date", FilterOperator.GREATER_THAN, date));
      q.setFilter(new FilterPredicate("date", FilterOperator.GREATER_THAN, date));
    }
//    q.setFilter(new CompositeFilter(CompositeFilterOperator.AND, filters));

    FetchOptions options = FetchOptions.Builder.withDefaults();
    String top = req.getParameter("top");
    if (top != null) {
      int t = Integer.parseInt(top);
      options.limit(t);
    }
    PreparedQuery prepared = datastore.prepare(q);


    Iterable<Entity> iterable = prepared.asIterable(options);

    resp.setContentType("application/json");
    resp.setCharacterEncoding("UTF-8");
    resp.setHeader("X-Chrome-Exponential-Throttling", "disable");

    PrintWriter writer = resp.getWriter();
    JsonWriter w = new JsonWriter(writer);
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
  }
}
