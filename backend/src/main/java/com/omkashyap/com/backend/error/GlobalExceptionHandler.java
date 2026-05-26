package com.omkashyap.com.backend.error;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
class GlobalExceptionHandler {

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

}