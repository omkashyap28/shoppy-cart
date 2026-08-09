package com.omkashyap.com.backend.dtoMapper;

import com.omkashyap.com.backend.dto.responseDto.ReviewImageResponseDto;
import com.omkashyap.com.backend.dto.responseDto.ReviewResponseDto;
import com.omkashyap.com.backend.entity.Review;
import com.omkashyap.com.backend.entity.ReviewImage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ReviewDtoMapper {

  public ReviewResponseDto mapToDto(Review review) {
    ReviewResponseDto dto = new ReviewResponseDto();
    dto.setReviewId(review.getReviewId());
    dto.setMessage(review.getMessage());
    dto.setRating(review.getRating());
    dto.setUserId(review.getUser().getUserId());
    dto.setProfileImgUrl(review.getUser().getAvatarUrl());
    dto.setEdited(review.getEdited());
    dto.setCreatedAt(review.getCreatedAt());

    if(review.getUser().getLastName() == null || review.getUser().getLastName().isEmpty()) {
      dto.setUsername(review.getUser().getFirstName());
    } else {
      dto.setUsername(review.getUser().getFirstName() + " " + review.getUser().getLastName());
    }

    List<ReviewImage> images = review.getReviewImages();
    dto.setReviewImages(
        images.stream()
            .map(img -> ReviewImageResponseDto.builder()
                .imageId(img.getImageId())
                .thumbnailUrl(img.getThumbnailUrl())
                .imageUrl(img.getImageUrl())
                .build())
            .toList()
    );

    return dto;
  }


}
