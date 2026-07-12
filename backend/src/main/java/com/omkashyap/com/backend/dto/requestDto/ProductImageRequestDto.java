package com.omkashyap.com.backend.dto.requestDto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProductImageRequestDto {

  @NotBlank(message = "Image id is required")
  private String imageId;

  @NotBlank(message = "Image url is required")
  private String imageUrl;

  @NotBlank(message = "Thumbnail url is required")
  private String thumbnailUrl;

  private Boolean isThumbnail;

  private Integer priority;

  @Size(max = 255, message = "Alt text doesn't contains more than 255 characters")
  private String altText;
}
