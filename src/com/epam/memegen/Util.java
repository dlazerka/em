package com.epam.memegen;

import java.io.IOException;

import com.google.appengine.api.datastore.Entity;
import com.google.gson.stream.JsonWriter;

public class Util {
  public static String sanitize(String str) {
    if (str == null) return null;
    return str.replaceAll("[^a-zA-Z0-9\\._-]", "");
  }

  public static void memeToJson(Entity meme, JsonWriter w) throws IOException {
    w.beginObject();

    long id = meme.getKey().getId();
    w.name("id");
    w.value(id);

    String fileName = (String) meme.getProperty("fileName");
    String src;
    if (fileName != null) {
      src = "/image/" + id + "/" + fileName;
      fileName = Util.sanitize(fileName);
    } else {
      src = "/image/" + id;
    }
    w.name("src").value(src);

    w.name("messages").beginArray();
    String topText = (String) meme.getProperty("topText");
    String centerText = (String) meme.getProperty("centerText");
    String bottomText = (String) meme.getProperty("bottomText");
    if (topText != null) {
      w.beginObject();
      w.name("text").value(topText);
      w.name("css").value("top-center");
      w.endObject();
    }
    if (bottomText != null) {
      w.beginObject();
      w.name("text").value(bottomText);
      w.name("css").value("bottom-center");
      w.endObject();
    }
    if (centerText != null) {
      w.beginObject();
      w.name("text").value(centerText);
      w.name("css").value("center-center");
      w.endObject();
    }
    w.endArray();
    w.endObject();
  }

  public static String getIdFromPathInfo(String pathInfo) {
    pathInfo = pathInfo.substring(1); // remove /
    pathInfo = pathInfo.replaceFirst("/.*$", "");
    String idStr = pathInfo.replaceAll("[^0-9]+", "");
    return idStr;
  }
}
