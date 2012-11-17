package com.epam.memegen;

import com.google.appengine.api.datastore.Entity;

public class Util {
  public static String sanitize(String str) {
    return str.replaceAll("[^a-zA-Z0-9\\._-]", "");
  }

  public static String memeToJson(Entity meme) {
    StringBuilder writer = new StringBuilder();
    writer.append("{");
    long id = meme.getKey().getId();
    String name = (String) meme.getProperty("name");
    name = Util.sanitize(name);
    writer.append("\"id\": " + id);
    writer.append(", \"src\": \"/image/" + id + "/" + name + "\"");
    writer.append("}");
    return writer.toString();
  }

  public static String getIdFromPathInfo(String pathInfo) {
    pathInfo = pathInfo.substring(1); // remove /
    pathInfo = pathInfo.replaceFirst("/.*$", "");
    String idStr = pathInfo.replaceAll("[^0-9]+", "");
    return idStr;
  }
}
