package com.omkashyap.com.backend.dto.responseDto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductDiscussionRepliesResponseDto {

  private String parentId;
  private String replyId;
  private String username;
  private String profileImgUrl;
  private String userId;
  private String message;
  private Boolean isEdited;
  private Long likes;
  private LocalDateTime createdAt;

}
