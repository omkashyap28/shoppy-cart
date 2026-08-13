package com.omkashyap.com.backend.service;

import com.omkashyap.com.backend.dto.requestDto.ProductRequestDto;
import com.omkashyap.com.backend.dto.responseDto.InfiniteScrollResponseDto;
import com.omkashyap.com.backend.dto.responseDto.ProductResponseDto;
import com.omkashyap.com.backend.dto.responseDto.ProductsResponseDto;

import java.util.List;
import java.util.Map;

public interface ProductService {
  ProductResponseDto addNewProduct(String sellerId, ProductRequestDto productRequestDto);

  ProductResponseDto getProductById(String productId, String refId);

  ProductResponseDto patchProductById(String sellerId, String productId, Map<String, Object> values);

  List<ProductsResponseDto> getAllProducts(String sellerId);

  void deleteProductBySellerId(String sellerId, String productId);

  ProductResponseDto getProductBySellerAndProductId(String sellerId, String productId);

  InfiniteScrollResponseDto<ProductsResponseDto> getInitialProducts(int limit, Long lastProductId);
}
