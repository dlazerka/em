package com.epam.memegen;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.blobstore.UploadOptions;
import com.google.gson.stream.JsonWriter;

@SuppressWarnings("serial")
public class UploadServlet extends HttpServlet {
  private static final Logger logger = Logger.getLogger(AdminUploadServlet.class.getName());
  private BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();

  /** Creates and returns a new upload url. */
  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    resp.setContentType("text/plain");
    String uploadUrl = createUploadUrl();
    resp.getWriter().write(uploadUrl);
  }

  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    resp.setContentType("application/json");
    Map<String, List<BlobKey>> blobs = blobstoreService.getUploads(req);
    List<BlobKey> blobKeys = blobs.get("image");

    if (blobKeys.isEmpty()) {
      resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "No blobKeys for 'image' field");
      return;
    }

    JsonWriter jsonWriter = new JsonWriter(resp.getWriter());
    jsonWriter.setIndent("  ");
    jsonWriter.beginObject();
    String uploadUrl = createUploadUrl();
    jsonWriter.name("newUploadUrl").value(uploadUrl);
    jsonWriter.name("uploads");
    jsonWriter.beginArray();
    for (BlobKey key : blobKeys) {
      String blobKeyS = key.getKeyString();
      logger.info("Received blob " + blobKeyS);
      jsonWriter.beginObject();
      jsonWriter.name("src").value("/image/preview?blobKey=" + blobKeyS);
      jsonWriter.name("blobKey").value(blobKeyS);
      jsonWriter.endObject();
    }
    jsonWriter.endArray();
    jsonWriter.endObject();
    jsonWriter.close();
  }

  private String createUploadUrl() {
    UploadOptions uploadOptions = UploadOptions.Builder.withMaxUploadSizeBytes(1 << 20);
    String contextPath = getServletContext().getContextPath();
    String uploadUrl = blobstoreService.createUploadUrl(contextPath, uploadOptions);
    return uploadUrl;
  }
}
