package com.omkashyap.com.backend.dto.responseDto;

import lombok.Builder;
import lombok.Data;


import java.math.BigDecimal;

@Data
@Builder
public class AffiliateProductAnalyticsResponseDto {

  private Long totalClicks;
  private Long totalConversions;
  private BigDecimal totalEarnings;
  private String productId;
  private String productUrl;

}
