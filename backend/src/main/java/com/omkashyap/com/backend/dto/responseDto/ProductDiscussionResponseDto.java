package com.omkashyap.com.backend.dto.responseDto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductDiscussionResponseDto {

  private String discussionId;
  private String productId;
  private String username;
  private String profileImgUrl;
  private String userId;
  private LocalDateTime createdAt;
  private String message;
  private Boolean isEdited;
  private Long likes;
  private Long replies;

}
