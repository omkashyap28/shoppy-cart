package com.omkashyap.com.backend.error;

public class TemporaryLockException extends RuntimeException {

  public TemporaryLockException(String message) {
    super(message);
  }

}
