package com.omkashyap.com.backend.error;

public class SessionNotFoundException extends AuthException {
  public SessionNotFoundException(String message) {
    super(message);
  }
}
