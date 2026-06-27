package com.omkashyap.com.backend.error;

public class TokenReusedException extends AuthException{
  public TokenReusedException(String message) {
    super(message);
  }
}
