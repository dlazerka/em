package com.epam.memegen;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.google.gson.JsonParser;

@SuppressWarnings("serial")
public class MemeServlet extends HttpServlet {
  private static final Logger logger = Logger.getLogger(MemeServlet.class.getName());
  private final MemeDao memeDao = new MemeDao();

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

    String json = memeDao.getAsJson(id);
    if (json == null) {
      resp.sendError(HttpServletResponse.SC_NOT_FOUND);
      return;
    }
    resp.getWriter().write(json);
  }

  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException,
      IOException {
    String top = null;
    String center = null;
    String bottom = null;
    String blobKey;
    try {
      JsonElement element = new JsonParser().parse(req.getReader());
      JsonObject jsonObject = element.getAsJsonObject();
      JsonObject messages = jsonObject.getAsJsonObject("messages");
      if (messages.has("top")) {
        top = messages.get("top").getAsString();
      }
      if (messages.has("center")) {
        center = messages.get("center").getAsString();
      }
      if (messages.has("bottom")) {
        bottom = messages.get("bottom").getAsString();
      }
      if (jsonObject.has("blobKey")) {
        blobKey = jsonObject.get("blobKey").getAsString();
      } else {
        resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "No 'blobKey' param");
        return;
      }
    } catch (JsonParseException e) {
      resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return;
    } catch (ClassCastException e) {
      resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return;
    } catch (IllegalStateException e) {
      resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return;
    } catch (NullPointerException e) {
      logger.log(Level.WARNING, "Maybe just a param is not given", e);
      resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
      return;
    }

    String json = memeDao.create(blobKey, top, center, bottom);
    resp.setStatus(HttpServletResponse.SC_OK);
    resp.getWriter().write(json);
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

    try {
      memeDao.delete(id);
    } catch (EntityNotFoundException e) {
      resp.sendError(404, "No such meme");
      return;
    }
  }

}
