package com.omkashyap.com.backend.service.impl;

import com.omkashyap.com.backend.dto.requestDto.AffiliateProductRequestDto;
import com.omkashyap.com.backend.dto.responseDto.*;
import com.omkashyap.com.backend.dtoMapper.ProductDtoMapper;
import com.omkashyap.com.backend.entity.AffiliateUser;
import com.omkashyap.com.backend.entity.AffiliateUserProduct;
import com.omkashyap.com.backend.entity.Product;
import com.omkashyap.com.backend.entity.User;
import com.omkashyap.com.backend.repository.AffiliateUserProductRepository;
import com.omkashyap.com.backend.repository.AffiliateUserRepository;
import com.omkashyap.com.backend.repository.ProductRepository;
import com.omkashyap.com.backend.repository.RoleRepository;
import com.omkashyap.com.backend.repository.UserRepository;
import com.omkashyap.com.backend.security.JwtUtil;
import com.omkashyap.com.backend.service.AffiliateUserService;
import com.omkashyap.com.backend.util.AffiliateUtil;
import com.omkashyap.com.backend.util.EmailUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.omkashyap.com.backend.entity.Role;
import com.omkashyap.com.backend.type.RoleEnum;

import java.math.BigDecimal;
import java.util.List;
import java.util.HashSet;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AffiliateUserServiceImpl implements AffiliateUserService {

  private final AffiliateUserRepository affiliateUserRepository;
  private final AffiliateUserProductRepository affiliateUserProductRepository;
  private final UserRepository userRepository;
  private final ProductDtoMapper productDtoMapper;
  private final ProductRepository productRepository;
  private final RoleRepository roleRepository;
  private final AffiliateUtil affiliateUtil;
  private final EmailUtil emailUtil;
  private final JwtUtil jwtUtil;

  @Override
  public AffiliateUserAuthResponseDto registerAffiliateUser(String email) {

    boolean isExists = affiliateUserRepository.existsByUser_Email(email);

    if (isExists) {
      throw new IllegalArgumentException("Affiliate account already exists");
    }
    
    User user = userRepository.findByEmail(email).orElseThrow(() ->
        new IllegalArgumentException("User not founded with this email"));

    Role role = roleRepository.findByRole(RoleEnum.ROLE_AFFILIATE).orElseThrow(() ->
        new IllegalArgumentException("Role not founded"));

    AffiliateUser affiliateUser = AffiliateUser.builder()
        .affiliateCode(generateAffiliateCode())
        .user(user)
        .build();
    affiliateUserRepository.save(affiliateUser);

    if(user.getRoles() == null) {
        user.setRoles(new HashSet<>());
    }
    user.getRoles().add(role);
    userRepository.save(user);

    String refreshToken = jwtUtil.generateRefreshToken(email, user.getRoles().stream()
        .map(userRole -> userRole.getRole().name())
        .toList()
    );

    emailUtil.sendAffiliateWelcomeEmail(
        user.getEmail(),
        user.getFirstName(),
        affiliateUser.getAffiliateCode()
    );

    return AffiliateUserAuthResponseDto.builder()
        .refreshToken(refreshToken)
        .affiliateCode(affiliateUser.getAffiliateCode())
        .userId(affiliateUser.getUser().getUserId())
        .build();
  }

  @Override
  public AffiliateUserResponseDto getAffiliateUserById(String affiliateCode) {
    AffiliateUser affiliateUser = affiliateUserRepository.findByAffiliateCode(affiliateCode).orElseThrow(() ->
        new IllegalArgumentException("Affiliate not exists or Invalid affiliate code"));

    return AffiliateUserResponseDto.builder()
        .affiliateCode(affiliateUser.getAffiliateCode())
        .userId(affiliateUser.getUser().getUserId())
        .build();
  }

  @Override
  public List<ProductResponseDto> getAffiliateUserProducts(String affiliateCode) {
    List<AffiliateUserProduct> affiliateUserProducts = affiliateUserProductRepository
        .findAllByAffiliateUser_AffiliateCode(affiliateCode);

    return affiliateUserProducts.stream()
        .map(productDtoMapper::mapToDto)
        .toList();
  }

  @Override
  public ProductResponseDto getAffiliateUserProductById(String affiliateCode, String productId) {
    AffiliateUserProduct affiliateUserProduct = affiliateUserProductRepository
        .findByAffiliateUser_AffiliateCodeAndProduct_ProductId(affiliateCode, productId).orElseThrow(() ->
            new IllegalArgumentException("Product is not exists for this affiliate user"));

    affiliateUserProduct.increaseClick();
    affiliateUserProductRepository.save(affiliateUserProduct);

    return productDtoMapper.mapToDto(affiliateUserProduct);
  }

  @Override
  @Transactional
  public void deleteAffiliateUserProductById(String affiliateCode, String productId) {
    affiliateUserProductRepository.deleteByAffiliateUser_AffiliateCodeAndProduct_ProductId(affiliateCode, productId);
  }

  @Override
  @Transactional
  public void deleteAffiliateUserById(String affiliateCode) {
    affiliateUserRepository.deleteByAffiliateCode(affiliateCode);
  }

  @Override
  public List<ProductResponseDto> addAffiliateProductToUser(String affiliateCode, AffiliateProductRequestDto requestDto) {
    AffiliateUser user = affiliateUserRepository.findByAffiliateCode(affiliateCode).orElseThrow(() ->
        new IllegalArgumentException("Affiliate not exists"));
    Product product = productRepository.findByProductId(requestDto.getProductId()).orElseThrow(() ->
        new IllegalArgumentException("Product not exists"));

    AffiliateUserProduct affiliateUserProduct = AffiliateUserProduct.builder()
        .affiliateUser(user)
        .product(product)
        .commissionPercentage(product.getAffiliateCommission().getCommissionPercentage())
        .affiliateLink(affiliateUtil.generateAffiliateLink(product.getProductUrl(), affiliateCode))
        .build();

    affiliateUserProductRepository.save(affiliateUserProduct);

    List<AffiliateUserProduct> affiliateUserProducts = affiliateUserProductRepository.
        findAllByAffiliateUser_AffiliateCode(affiliateCode);

    return affiliateUserProducts.stream()
        .map(productDtoMapper::mapToDto)
        .toList();
  }

  @Override
  public AffiliateProductAnalyticsResponseDto getAffiliateProductAnalytics(String affiliateCode, String productId) {
    AffiliateUserProduct affiliateUserProduct = affiliateUserProductRepository
        .findByAffiliateUser_AffiliateCodeAndProduct_ProductId(affiliateCode, productId).orElseThrow(() ->
            new IllegalArgumentException("Product is not exists for this affiliate user"));

    return AffiliateProductAnalyticsResponseDto.builder()
        .totalClicks(affiliateUserProduct.getTotalClicks())
        .totalConversions(affiliateUserProduct.getTotalConversions())
        .totalEarnings(affiliateUserProduct.getTotalEarnings())
        .productId(affiliateUserProduct.getProduct().getProductId())
        .productUrl(affiliateUserProduct.getAffiliateLink())
        .build();
  }

  @Override
  public AffiliateAllProductAnalyticsResponseDto getAffiliateAllProductsAnalytics(
      String affiliateCode
  ) {
    List<AffiliateUserProduct> affiliateUserProducts =
        affiliateUserProductRepository
            .findAllByAffiliateUser_AffiliateCode(affiliateCode);

    long totalClicks = affiliateUserProducts.stream()
        .mapToLong(AffiliateUserProduct::getTotalClicks)
        .sum();

    BigDecimal totalEarnings = affiliateUserProducts.stream()
        .map(AffiliateUserProduct::getTotalEarnings)
        .filter(Objects::nonNull)
        .reduce(BigDecimal.ZERO, BigDecimal::add);

    long totalConversion = affiliateUserProducts.stream()
        .mapToLong(AffiliateUserProduct::getTotalConversions)
        .sum();

    return AffiliateAllProductAnalyticsResponseDto.builder()
        .totalConversions(totalConversion)
        .totalClicks(totalClicks)
        .totalEarnings(totalEarnings)
        .build();
  }

  private String generateAffiliateCode() {
    return UUID.randomUUID().toString().replace("-", "");
  }

}
