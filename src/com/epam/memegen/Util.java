package com.epam.memegen;

import com.google.appengine.api.datastore.Entity;

public class Util {
  public static String sanitize(String str) {
    if (str == null) return null;
    return str.replaceAll("[^a-zA-Z0-9\\._-]", "");
  }

  public static String memeToJson(Entity meme) {
    StringBuilder writer = new StringBuilder();
    writer.append("{");
    long id = meme.getKey().getId();
    writer.append("\"id\": " + id);

    String fileName = (String) meme.getProperty("fileName");
    String src;
    if (fileName != null) {
      src = "\"/image/" + id + "/" + fileName + "\"";
      fileName = Util.sanitize(fileName);
    } else {
      src = "\"/image/" + id + "";
    }
    writer.append(", \"src\": " + src);

    String topText = (String) meme.getProperty("topText");
    String centerText = (String) meme.getProperty("centerText");
    String bottomText = (String) meme.getProperty("bottomText");
    writer.append(", \"messages\": [");
    if (topText != null) writer.append(", {\"text\": " + topText + "}");
    if (centerText != null) writer.append(", \"text\": " + centerText);
    if (bottomText != null) writer.append(", \"text\": " + bottomText);
    writer.append("]");

    Long timestamp = (Long) meme.getProperty("timestamp");
    if (timestamp != null) writer.append(", \"timestamp\": " + timestamp);

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
