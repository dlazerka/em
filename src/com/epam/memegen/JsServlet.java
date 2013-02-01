package com.epam.memegen;

import java.io.FileInputStream;
import java.io.IOException;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.apache.commons.io.output.ByteArrayOutputStream;

import com.google.appengine.api.utils.SystemProperty;
import com.google.appengine.api.utils.SystemProperty.Environment;

@SuppressWarnings("serial")
public class JsServlet extends HttpServlet {

  /** Relative to servlet root ("war") directory. */
  private static final String[] FILES = new String[] {
    "components/msg/Msg.js",
    "components/comment/Comment.js",
    "components/comment/CommentView.js",
    "components/comment/Comments.js",
    "components/comment/CommentsView.js",
    "components/comment/CommentForm.js",
    "components/vote/Vote.js",
    "components/vote/VoteView.js",
    "components/meme/Meme.js",
    "components/meme/MemeView.js",
    "components/meme/Memes.js",
    "components/create/MemePreview.js",
    "components/create/CreateView.js",
    "js/analytics.js",
    "js/plugin.js",
    "js/AppRouter.js",
    "js/main.js",
  };

  private byte[] combined;

  private void readCombine() throws IOException {
    ByteArrayOutputStream os = new ByteArrayOutputStream(256 * 1024);

    for (String filePath : FILES) {
      FileInputStream is = new FileInputStream(filePath);
      try {
        IOUtils.copy(is, os);
      } finally {
        IOUtils.closeQuietly(is);
      }
      os.write('\n');
    }

    combined = os.toByteArray();
  }

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    if (SystemProperty.environment.value() == Environment.Value.Development) {
      readCombine();
    }
    resp.setContentType("application/javascript");
    resp.setCharacterEncoding("UTF-8");
    resp.setHeader("Cache-Control", "public, max-age=2592000");// 1 month
    resp.getOutputStream().write(combined);
  }

  @Override
  public void init(ServletConfig config) throws ServletException {
    try {
      readCombine();
    } catch(IOException e) {
      throw new ServletException(e);
    }
  }

}
