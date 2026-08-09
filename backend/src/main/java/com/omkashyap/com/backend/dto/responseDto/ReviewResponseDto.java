package com.omkashyap.com.backend.dto.responseDto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
public class ReviewResponseDto {

  private String reviewId;
  private Integer rating;
  private String message;
  private List<ReviewImageResponseDto> reviewImages;
  private String userId;
  private String profileImgUrl;
  private String username;
  private Boolean edited;
  private LocalDateTime createdAt;

}