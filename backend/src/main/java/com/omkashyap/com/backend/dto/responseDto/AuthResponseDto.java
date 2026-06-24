package com.omkashyap.com.backend.dto.responseDto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthResponseDto {

  private String refreshToken;
  private String accessToken;
  private String deviceId;
  private String userId;
  private String email;
  private String sellerId;
  private String affiliateCode;

}
