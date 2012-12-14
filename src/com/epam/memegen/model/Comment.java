package com.epam.memegen.model;

/**
 * @author Andrey Mormysh
 */
public class Comment {
  public static final String KIND = "Comment";
  public static final String MEME_ID = "memeId";
  public static final String TEXT = "text";
  public static final String TIMESTAMP = "timestamp";
  public static final String USER = "user";

  private long memeId;
  private String text;
  private long timestamp;
  private String user;

  public Comment() {
  }

  public Comment(long memeId, String text, long timestamp, String user) {
    this.memeId = memeId;
    this.text = text;
    this.timestamp = timestamp;
    this.user = user;
  }

  public long getMemeId() {
    return memeId;
  }

  public void setMemeId(long memeId) {
    this.memeId = memeId;
  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }

  public long getTimestamp() {
    return timestamp;
  }

  public void setTimestamp(long timestamp) {
    this.timestamp = timestamp;
  }

  public String getUser() {
    return user;
  }

  public void setUser(String user) {
    this.user = user;
  }
}
