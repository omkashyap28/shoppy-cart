package com.omkashyap.com.backend.dto.responseDto;

import lombok.Builder;
import lombok.Data;


import java.time.LocalDateTime;

@Data
@Builder
public class SearchHistoryResponseDto {

  private String searchId;
  private String searchText;
  private LocalDateTime searchedAt;

}
