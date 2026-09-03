package com.omkashyap.com.backend.error;

public class NotFoundException extends RuntimeException {

  public NotFoundException(String message) {
    super(message);
  }

}
