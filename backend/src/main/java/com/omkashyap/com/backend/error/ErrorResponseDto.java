package com.omkashyap.com.backend.error;

import java.time.LocalDateTime;

public record ErrorResponseDto(
    int status,
    String error,
    String message,
    LocalDateTime timestamp
) {
}
