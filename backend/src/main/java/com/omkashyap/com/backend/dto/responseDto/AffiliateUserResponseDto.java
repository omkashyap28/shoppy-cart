package com.omkashyap.com.backend.dto.responseDto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AffiliateUserResponseDto {

  private String affiliateCode;
  private String userId;

}
