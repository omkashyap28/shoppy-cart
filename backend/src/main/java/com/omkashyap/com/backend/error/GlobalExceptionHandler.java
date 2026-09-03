package com.omkashyap.com.backend.error;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
class GlobalExceptionHandler {

  @ExceptionHandler(SessionNotFoundException.class)
  public ResponseEntity<ErrorResponseDto> handleSessionNotFound(SessionNotFoundException sessionNotFoundException) {
    return responseBuilder(HttpStatus.UNAUTHORIZED, sessionNotFoundException.getMessage());
  }

  @ExceptionHandler(InvalidTokenException.class)
  public ResponseEntity<ErrorResponseDto> handleInvalidTokenException(InvalidTokenException invalidTokenException) {
    return responseBuilder(HttpStatus.UNAUTHORIZED, invalidTokenException.getMessage());
  }

  @ExceptionHandler(TokenReusedException.class)
  public  ResponseEntity<ErrorResponseDto> handleTokenReusedException(TokenReusedException tokenReusedException) {
    return responseBuilder(HttpStatus.FORBIDDEN, tokenReusedException.getMessage());
  }

  @ExceptionHandler(InvalidArgumentException.class)
  public ResponseEntity<ErrorResponseDto> handleInvalidMpinException(InvalidArgumentException invalidMpinException) {
    return responseBuilder(HttpStatus.UNPROCESSABLE_CONTENT, invalidMpinException.getMessage());
  }

  @ExceptionHandler(NotFoundException.class)
  public ResponseEntity<ErrorResponseDto> handleNotFoundException(NotFoundException notFoundException) {
    return responseBuilder(HttpStatus.NOT_FOUND, notFoundException.getMessage());
  }

  @ExceptionHandler(TemporaryLockException.class)
  public ResponseEntity<ErrorResponseDto> handleTemporaryLockException(TemporaryLockException temporaryLockException) {
    return responseBuilder(HttpStatus.LOCKED, temporaryLockException.getMessage());
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponseDto> handleException(
      Exception ex
  ) {
    HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (ex instanceof IllegalAccessException) {
      status = HttpStatus.BAD_REQUEST;
    } else if (ex instanceof NoSuchFieldException) {
      status = HttpStatus.NOT_FOUND;
    }

    ErrorResponseDto response = new ErrorResponseDto(
        status.value(),
        status.getReasonPhrase(),
        ex.getMessage(),
        LocalDateTime.now()
    );

    return new ResponseEntity<>(response, status);
  }

  private ResponseEntity<ErrorResponseDto> responseBuilder(HttpStatus status, String message) {
    ErrorResponseDto body =  new ErrorResponseDto(
        status.value(),
        status.getReasonPhrase(),
        message,
        LocalDateTime.now()
    );

    return ResponseEntity.status(status).body(body);
  }

}