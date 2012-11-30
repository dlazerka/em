package com.epam.memegen;

import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.blobstore.UploadOptions;

public class Util {
  private BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();

  public static String getIdFromPathInfo(String pathInfo) {
    pathInfo = pathInfo.substring(1); // remove /
    pathInfo = pathInfo.replaceFirst("/.*$", "");
    String idStr = pathInfo.replaceAll("[^0-9]+", "");
    return idStr;
  }

  public static boolean isNullOrEmpty(String str) {
    return str == null || str.trim().equals("");
  }

  public String createUploadUrl() {
    UploadOptions uploadOptions = UploadOptions.Builder.withMaxUploadSizeBytes(1 << 20);
    // Success path doesn't matter because we're uploading by AJAX.
    String uploadUrl = blobstoreService.createUploadUrl("/upload", uploadOptions);
    return uploadUrl;
  }
}
