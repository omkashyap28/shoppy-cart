package com.omkashyap.com.backend.service;

import com.omkashyap.com.backend.dto.requestDto.ProductDiscussionRepliesRequestDto;
import com.omkashyap.com.backend.dto.requestDto.ProductDiscussionRequestDto;
import com.omkashyap.com.backend.dto.requestDto.ProductDiscussionUpdateRequestDto;
import com.omkashyap.com.backend.dto.responseDto.InfiniteScrollResponseDto;
import com.omkashyap.com.backend.dto.responseDto.ProductDiscussionRepliesResponseDto;
import com.omkashyap.com.backend.dto.responseDto.ProductDiscussionResponseDto;

import java.util.List;

public interface ProductDiscussionService {

  ProductDiscussionResponseDto addDiscussionToProduct(
      String authHeader,
      String productId,
      ProductDiscussionRequestDto requestDto
  );

  InfiniteScrollResponseDto<ProductDiscussionResponseDto>
  getAllProductDiscussions(
      String productId,
      Long cursor,
      int size
  );

  ProductDiscussionResponseDto getProductDiscussionById(String discussionId);

  ProductDiscussionResponseDto partialUpdateProductDiscussion(
      String discussionId,
      ProductDiscussionUpdateRequestDto requestDto
  );

  void deleteProductDiscussion(String discussionId);

  ProductDiscussionRepliesResponseDto addDiscussionReplyToProduct(
      String authHeader,
      String discussionId,
      ProductDiscussionRepliesRequestDto requestDto
  );

  List<ProductDiscussionRepliesResponseDto> getAllProductDiscussionsReplies(String discussionId);

  ProductDiscussionRepliesResponseDto partialUpdateProductDiscussionReply(
      String discussionId,
      ProductDiscussionUpdateRequestDto requestDto
  );

  ProductDiscussionRepliesResponseDto getProductDiscussionReplyById(String discussionId);

  InfiniteScrollResponseDto<ProductDiscussionResponseDto> getAllDiscussionByUser(
      String authHeader,
      Long cursor,
      int size
  );

  List<ProductDiscussionResponseDto> getProductLimitedDiscussions(String productId, int limit);
}
