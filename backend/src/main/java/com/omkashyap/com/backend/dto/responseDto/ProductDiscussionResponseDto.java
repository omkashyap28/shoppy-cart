package com.omkashyap.com.backend.dto.responseDto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductDiscussionResponseDto {

  private String discussionId;
  private String productId;
  private String userId;
  private String message;
  private Boolean isEdited;
  private Long likes;

}
