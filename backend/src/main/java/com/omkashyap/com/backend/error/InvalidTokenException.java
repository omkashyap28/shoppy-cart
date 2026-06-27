package com.omkashyap.com.backend.error;

public class InvalidTokenException extends AuthException {
  public InvalidTokenException(String message) {
    super(message);
  }
}
