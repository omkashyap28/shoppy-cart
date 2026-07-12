package com.omkashyap.com.backend.dto.responseDto;

import com.omkashyap.com.backend.type.CategoryEnum;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SellerResponseDto {

  private String sellerId;

  private String shopName;

  private String description;

  private Float averageRating;

  private Integer ratingCount;

  private CategoryEnum category;

  private List<ProductResponseDto> products;

  private ShopAddressResponseDto shopAddress;

  private Boolean isVerified;

  private LocalDateTime createdAt;

}
