package com.omkashyap.com.backend.dto.requestDto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class ReviewRequestDto {

  @NotEmpty(message = "User ID is required")
  @Size(min = 32, max = 32, message = "User ID should be exactly contains 32 chars")
  private String userId;

  @NotNull(message = "Rating is required")
  @Size(min = 1, max = 5, message = "Rating can only in between 1-5")
  private Integer rating;

  @Max(value = 200, message = "Message only contains maximum 200 characters")
  private String message;

  private List<ReviewImageRequestDto> reviewImages;

}
