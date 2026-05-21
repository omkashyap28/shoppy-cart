package com.omkashyap.com.backend.service;

import com.omkashyap.com.backend.dto.requestDto.AffiliateProductRequestDto;
import com.omkashyap.com.backend.dto.responseDto.*;

import java.util.List;

public interface AffiliateUserService {
  AffiliateUserResponseDto registerAffiliateUser(String email);

  AffiliateUserResponseDto getAffiliateUserById(String affiliateCode);

  List<ProductResponseDto> getAffiliateUserProducts(String affiliateCode);

  List<ProductResponseDto> addAffiliateProductToUser(String affiliateCode, AffiliateProductRequestDto requestDto);

  AffiliateProductAnalyticsResponseDto getAffiliateProductAnalytics(String affiliateCode, String productId);

  AffiliateAllProductAnalyticsResponseDto getAffiliateAllProductsAnalytics(String affiliateCode);

  ProductResponseDto getAffiliateUserProductById(String affiliateCode, String productId);

  void deleteAffiliateUserProductById(String affiliateCode, String productId);

  void deleteAffiliateUserById(String affiliateCode);
}
