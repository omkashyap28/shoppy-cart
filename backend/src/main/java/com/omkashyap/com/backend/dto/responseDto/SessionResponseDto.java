package com.omkashyap.com.backend.dto.responseDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SessionResponseDto {

  private String sessionId;
  private String deviceInformation;
  private Boolean isCurrent;
  private Boolean isActive;

}
