package com.epam.memegen;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.logging.Logger;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.epam.memegen.MemeDao.Sort;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheServiceFactory;
import com.google.gson.stream.JsonWriter;

@SuppressWarnings("serial")
public class MemesStatsServlet extends HttpServlet {

  @SuppressWarnings("unused")
  private static final Logger logger = Logger.getLogger(MemesStatsServlet.class.getName());

  private final MemeDao memeDao = new MemeDao();

  public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    resp.setContentType("application/json");
    resp.setCharacterEncoding("UTF-8");
    resp.setHeader("X-Chrome-Exponential-Throttling", "disable");

    String sinceS = req.getParameter("since");
    Long since;
    try {
      since = sinceS == null ? null : Long.parseLong(sinceS);
    } catch (NumberFormatException e) {
      since = null;
    }

    // No more than 99
    List<Long> timestamps = memeDao.getTimestamps();
    int count;
    long last = timestamps.isEmpty() ? 0 : timestamps.get(0);

    if (since == null) {
      count = timestamps.size();
    } else {
      count = 0;
      for (long timestamp : timestamps) {
        if (timestamp <= since) {
          break;
        }
        count++;
      }
    }

    JsonWriter jw = new JsonWriter(resp.getWriter());
    jw.beginObject();
//    jw.name("reset").value(1);
    jw.name("count").value(count);
    jw.name("last").value(last);
    jw.endObject();
    jw.close();
  }
}
