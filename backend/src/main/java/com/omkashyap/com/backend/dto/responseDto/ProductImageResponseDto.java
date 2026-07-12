package com.omkashyap.com.backend.dto.responseDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductImageResponseDto {
  private String imageUrl;
  private String thumbnailUrl;
  private String imageId;
  private Integer priority;
  private String altText;
}
