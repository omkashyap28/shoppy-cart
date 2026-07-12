package com.omkashyap.com.backend.dto.requestDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class ProductRequestDto {

  private String brandName;
  private String description;
  private Integer quantity;
  private Long categoryId;
  private Float price;
  private List<ProductImageRequestDto> productImages;
  private List<ProductAttributeRequestDto> productAttributes;
  private List<String> tags;

}
