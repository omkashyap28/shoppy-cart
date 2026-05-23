package com.omkashyap.com.backend.dtoMapper;

import com.omkashyap.com.backend.dto.responseDto.ProductDiscussionRepliesResponseDto;
import com.omkashyap.com.backend.dto.responseDto.ProductDiscussionResponseDto;
import com.omkashyap.com.backend.entity.ProductDiscussion;
import org.springframework.stereotype.Component;

@Component
public class ProductDiscussionDtoMapper {

  public ProductDiscussionResponseDto mapToDto(ProductDiscussion productDiscussion) {

    return ProductDiscussionResponseDto.builder()
        .discussionId(productDiscussion.getDiscussionId())
        .productId(productDiscussion.getDiscussionId())
        .userId(productDiscussion.getUser().getUserId())
        .message(productDiscussion.getMessage())
        .likes((long) productDiscussion.getLikes().size())
        .isEdited(productDiscussion.getEdited())
        .build();
  }

  public ProductDiscussionRepliesResponseDto mapToReplyDto(ProductDiscussion productDiscussion) {
    return ProductDiscussionRepliesResponseDto.builder()
        .parentId(productDiscussion.getParent().getDiscussionId())
        .replyId(productDiscussion.getDiscussionId())
        .userId(productDiscussion.getUser().getUserId())
        .message(productDiscussion.getMessage())
        .isEdited(productDiscussion.getEdited())
        .likes((long) productDiscussion.getLikes().size())
        .build();
  }
}
