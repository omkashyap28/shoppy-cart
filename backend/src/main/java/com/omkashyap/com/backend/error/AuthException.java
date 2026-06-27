package com.omkashyap.com.backend.error;

public abstract class AuthException extends RuntimeException {

  public AuthException(String message) {
    super(message);
  }

}
