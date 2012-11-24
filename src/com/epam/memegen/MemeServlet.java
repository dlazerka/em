package com.epam.memegen;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.datastore.EntityNotFoundException;

@SuppressWarnings("serial")
public class MemeServlet extends HttpServlet {
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
    String topText = req.getParameter("topText");
    String centerText = req.getParameter("centerText");
    String bottomText = req.getParameter("bottomText");
    String blobKey = req.getParameter("blobKey");

    if (Util.isNullOrEmpty(blobKey)) {
      resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "No 'blobKey' param");
      return;
    }

    memeDao.create(blobKey, topText, centerText, bottomText);
    resp.setStatus(HttpServletResponse.SC_OK);
    resp.sendRedirect("/");
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
