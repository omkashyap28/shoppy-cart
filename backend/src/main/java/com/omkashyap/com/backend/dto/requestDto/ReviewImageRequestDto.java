package com.omkashyap.com.backend.dto.requestDto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReviewImageRequestDto {

  @NotBlank(message = "Image ID is required")
  private String imageId;

  @NotBlank(message = "Image URL is required")
  private String imageUrl;

  @NotBlank(message = "Thumbnail URL is required")
  private String thumbnailUrl;

}
