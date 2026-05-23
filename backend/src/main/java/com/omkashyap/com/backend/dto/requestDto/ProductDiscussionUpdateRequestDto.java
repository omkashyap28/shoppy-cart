package com.omkashyap.com.backend.dto.requestDto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductDiscussionUpdateRequestDto {

  @NotBlank(message = "Message is required")
  @Size(min = 2, max = 255, message = "Message should be in range of 2-255 characters")
  private String message;

}
