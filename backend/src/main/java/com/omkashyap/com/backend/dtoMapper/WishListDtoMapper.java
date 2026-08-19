package com.omkashyap.com.backend.dtoMapper;

import com.omkashyap.com.backend.dto.responseDto.WishListResponseDto;
import com.omkashyap.com.backend.entity.Product;
import com.omkashyap.com.backend.entity.WishListItem;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class WishListDtoMapper {

  public WishListResponseDto mapToDto(WishListItem wishListItem) {

    Product product = wishListItem.getProduct();

    WishListResponseDto responseDto = WishListResponseDto.builder()
        .wishlistId(wishListItem.getWishListItemId())
        .productId(product.getProductId())
        .productUrl(product.getProductUrl())
        .averageRating(product.getAverageRating())
        .brandName(product.getBrandName())
        .description(product.getDescription())
        .productThumbnail(product.getProductThumbnail())
        .description(product.getDescription())
        .inStock(product.getInStock())
        .price(product.getPrice())
        .coins(product.getCoins())
        .totalReviews(product.getTotalReviews())
        .build();
    Map<String, String> productAttr = new HashMap<>();
    wishListItem.getProductAttributes().forEach(
        attr -> productAttr.put(
            attr.getAttributeName(),
            attr.getAttributeValue()
        )
    );
    responseDto.setProductAttributes(productAttr);

    return responseDto;
  }

}
