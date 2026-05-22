package com.omkashyap.com.backend.dto.responseDto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class InfiniteScrollResponseDto<T> {

  private List<T> content;
  private Long nextCursor;
  private Boolean hasMore;

}
