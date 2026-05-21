package com.omkashyap.com.backend.controller;

import com.omkashyap.com.backend.dto.requestDto.AffiliateProductRequestDto;
import com.omkashyap.com.backend.dto.responseDto.AffiliateAllProductAnalyticsResponseDto;
import com.omkashyap.com.backend.dto.responseDto.AffiliateProductAnalyticsResponseDto;
import com.omkashyap.com.backend.dto.responseDto.AffiliateUserResponseDto;
import com.omkashyap.com.backend.dto.responseDto.ProductResponseDto;
import com.omkashyap.com.backend.security.JwtUtil;
import com.omkashyap.com.backend.service.AffiliateUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/affiliate")
public class AffiliateController {

  private final JwtUtil jwtUtil;
  private final AffiliateUserService affiliateUserService;

  @PostMapping
  ResponseEntity<?> registerAffiliateUser(@RequestHeader("Authorization") String authHeader) {
    String token = authHeader.substring(7);
    String email = jwtUtil.getUserEmailFromToken(token);
    return ResponseEntity.status(HttpStatus.CREATED).body(affiliateUserService.registerAffiliateUser(email));
  }

  @GetMapping("/{affiliateCode}")
  ResponseEntity<AffiliateUserResponseDto> getAffiliateUserById(@PathVariable String affiliateCode) {
    return ResponseEntity.status(HttpStatus.OK).body(affiliateUserService.getAffiliateUserById(affiliateCode));
  }

  @DeleteMapping("/{affiliateCode}")
  ResponseEntity<Void> deleteAffiliateUserById(@PathVariable String affiliateCode) {
    affiliateUserService.deleteAffiliateUserById(affiliateCode);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/{affiliateCode}/products")
  ResponseEntity<List<ProductResponseDto>> addProductToAffiliate(@PathVariable String affiliateCode, @RequestBody AffiliateProductRequestDto requestDto) {
    return ResponseEntity.status(HttpStatus.OK).body(affiliateUserService.addAffiliateProductToUser(affiliateCode, requestDto));
  }

  @GetMapping("/{affiliateCode}/products")
  ResponseEntity<List<ProductResponseDto>> getAffiliateUserProducts(@PathVariable String affiliateCode) {
    return ResponseEntity.status(HttpStatus.OK).body(affiliateUserService.getAffiliateUserProducts(affiliateCode));
  }

  @GetMapping("/{affiliateCode}/products/{productId}")
  ResponseEntity<ProductResponseDto> getAffiliateUserProductById(@PathVariable String affiliateCode, @PathVariable String productId) {
    return ResponseEntity.status(HttpStatus.OK).body(affiliateUserService.getAffiliateUserProductById(affiliateCode, productId));
  }

  @DeleteMapping("/{affiliateCode}/products/{productId}")
  ResponseEntity<Void> deleteAffiliateUserProductById(@PathVariable String affiliateCode, @PathVariable String productId) {
    affiliateUserService.deleteAffiliateUserProductById(affiliateCode, productId);
    return ResponseEntity.noContent().build();
  }

  //  Analytics
  @GetMapping("/{affiliateCode}/products/{productId}/analytics")
  ResponseEntity<AffiliateProductAnalyticsResponseDto> getAffiliateProductAnalytics(@PathVariable String affiliateCode, @PathVariable String productId) {
    return ResponseEntity.status(HttpStatus.OK).body(affiliateUserService.getAffiliateProductAnalytics(affiliateCode, productId));
  }

  @GetMapping("/{affiliateCode}/analytics")
  ResponseEntity<AffiliateAllProductAnalyticsResponseDto> getAffiliateAllProductAnalytics(@PathVariable String affiliateCode) {
    return ResponseEntity.status(HttpStatus.OK).body(affiliateUserService.getAffiliateAllProductsAnalytics(affiliateCode));
  }

}
