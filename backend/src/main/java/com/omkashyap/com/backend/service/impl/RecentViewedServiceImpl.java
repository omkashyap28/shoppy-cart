package com.omkashyap.com.backend.service.impl;

import com.omkashyap.com.backend.dto.responseDto.ProductResponseDto;
import com.omkashyap.com.backend.dtoMapper.ProductDtoMapper;
import com.omkashyap.com.backend.entity.Product;
import com.omkashyap.com.backend.entity.RecentViewed;
import com.omkashyap.com.backend.entity.User;
import com.omkashyap.com.backend.repository.ProductRepository;
import com.omkashyap.com.backend.repository.RecentViewedRepository;
import com.omkashyap.com.backend.repository.UserRepository;
import com.omkashyap.com.backend.service.RecentViewedService;
import com.omkashyap.com.backend.util.AuthHeaderUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecentViewedServiceImpl implements RecentViewedService {

  private final RecentViewedRepository recentViewedRepository;
  private final UserRepository userRepository;
  private final ProductRepository productRepository;
  private final ProductDtoMapper productDtoMapper;
  private final AuthHeaderUtil authHeaderUtil;

  @Override
  public void saveRecentViewed(String authHeader, String productId) {

    String email = authHeaderUtil.getEmailFromAuthHeader(authHeader);

    RecentViewed recentViewed = recentViewedRepository.findByUser_EmailAndProduct_ProductId(email, productId).orElseGet(() -> {
      User user = userRepository.findByEmail(email).orElseThrow(() ->
          new IllegalArgumentException("User not exists"));

      Product product = productRepository.findByProductId(productId).orElseThrow(() ->
          new IllegalArgumentException("Product not exists for this id"));

      RecentViewed createRecentView = RecentViewed.builder()
          .user(user)
          .product(product)
          .build();
      return recentViewedRepository.save(createRecentView);
    });

    recentViewed.updateViewedAtTimeStamp();
    recentViewedRepository.save(recentViewed);
  }

  @Override
  public List<ProductResponseDto> getRecentViewedProducts(
      String userId
  ) {

    List<RecentViewed> recentVieweds = recentViewedRepository
        .findTop20ByUser_UserIdOrderByViewedAtDesc(userId);

    recentViewedRepository.deleteOldRecentViewed(userId);

    return recentVieweds.stream()
        .map(RecentViewed::getProduct)
        .map(productDtoMapper::mapToDto)
        .toList();
  }
}
