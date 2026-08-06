package com.omkashyap.com.backend.dtoMapper;

import com.omkashyap.com.backend.dto.responseDto.ProductDiscussionRepliesResponseDto;
import com.omkashyap.com.backend.dto.responseDto.ProductDiscussionResponseDto;
import com.omkashyap.com.backend.entity.ProductDiscussion;
import org.springframework.stereotype.Component;

@Component
public class ProductDiscussionDtoMapper {

  public ProductDiscussionResponseDto mapToDto(ProductDiscussion productDiscussion) {

    ProductDiscussionResponseDto responseDto = ProductDiscussionResponseDto.builder()
        .discussionId(productDiscussion.getDiscussionId())
        .productId(productDiscussion.getProduct().getProductId())
        .profileImgUrl(productDiscussion.getUser().getAvatarUrl())
        .userId(productDiscussion.getUser().getUserId())
        .createdAt(productDiscussion.getCreatedAt())
        .message(productDiscussion.getMessage())
        .likes((long) productDiscussion.getLikes().size())
        .isEdited(productDiscussion.getEdited())
        .replies((long) productDiscussion.getReplies().size())
        .build();

    if (productDiscussion.getUser().getLastName() != null) {
      responseDto
          .setUsername(productDiscussion.getUser().getFirstName() + " " + productDiscussion.getUser().getLastName());
    } else {
      responseDto.setUsername(productDiscussion.getUser().getFirstName());
    }

    return responseDto;
  }

  public ProductDiscussionRepliesResponseDto mapToReplyDto(ProductDiscussion productDiscussion) {
    ProductDiscussionRepliesResponseDto responseDto = ProductDiscussionRepliesResponseDto.builder()
        .parentId(productDiscussion.getParent().getDiscussionId())
        .replyId(productDiscussion.getDiscussionId())
        .userId(productDiscussion.getUser().getUserId())
        .profileImgUrl(productDiscussion.getUser().getAvatarUrl())
        .message(productDiscussion.getMessage())
        .isEdited(productDiscussion.getEdited())
        .likes((long) productDiscussion.getLikes().size())
        .createdAt(productDiscussion.getCreatedAt())
        .build();

    if (productDiscussion.getUser().getLastName() != null) {
      responseDto
          .setUsername(productDiscussion.getUser().getFirstName() + " " + productDiscussion.getUser().getLastName());
    } else {
      responseDto.setUsername(productDiscussion.getUser().getFirstName());
    }

    return responseDto;
  }
}
