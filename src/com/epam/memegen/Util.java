package com.epam.memegen;

import javax.servlet.http.HttpServlet;

import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.blobstore.UploadOptions;

public class Util {
  private BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();

  public static String sanitize(String str) {
    if (str == null) return null;
    return str.replaceAll("[^a-zA-Z0-9\\._-]", "");
  }

  public static String getIdFromPathInfo(String pathInfo) {
    pathInfo = pathInfo.substring(1); // remove /
    pathInfo = pathInfo.replaceFirst("/.*$", "");
    String idStr = pathInfo.replaceAll("[^0-9]+", "");
    return idStr;
  }

  public static boolean isNullOrEmpty(String str) {
    return str == null || str.trim().equals("");
  }

  public String createUploadUrl(HttpServlet servlet) {
    UploadOptions uploadOptions = UploadOptions.Builder.withMaxUploadSizeBytes(1 << 20);
    String contextPath = servlet.getServletContext().getContextPath();
    String uploadUrl = blobstoreService.createUploadUrl(contextPath, uploadOptions);
    return uploadUrl;
  }
}
