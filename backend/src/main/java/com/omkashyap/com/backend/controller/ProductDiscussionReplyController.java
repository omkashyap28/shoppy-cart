package com.omkashyap.com.backend.controller;

import com.omkashyap.com.backend.dto.requestDto.ProductDiscussionRepliesRequestDto;
import com.omkashyap.com.backend.dto.requestDto.ProductDiscussionUpdateRequestDto;
import com.omkashyap.com.backend.dto.responseDto.ProductDiscussionRepliesResponseDto;
import com.omkashyap.com.backend.service.ProductDiscussionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/product/{productId}/discussions/{discussionId}/replies")
public class ProductDiscussionReplyController {

  private final ProductDiscussionService productDiscussionService;

  @PostMapping
  ResponseEntity<ProductDiscussionRepliesResponseDto> addDiscussionReplyToProduct(
      @RequestHeader("Authorization") String authHeader,
      @PathVariable String discussionId,
      @RequestBody ProductDiscussionRepliesRequestDto requestDto
  ) {
    return ResponseEntity.status(HttpStatus.CREATED).body(
        productDiscussionService.addDiscussionReplyToProduct(authHeader, discussionId, requestDto)
    );
  }

  @GetMapping
  ResponseEntity<List<ProductDiscussionRepliesResponseDto>> getAllProductDiscussionsReplies(
      @PathVariable String discussionId
  ) {
    return ResponseEntity.status(HttpStatus.OK).body(
        productDiscussionService.getAllProductDiscussionsReplies(discussionId)
    );
  }

  @GetMapping("/{replyId}")
  ResponseEntity<ProductDiscussionRepliesResponseDto> getProductDiscussionById(
      @PathVariable String replyId
  ) {
    return ResponseEntity.status(HttpStatus.OK).body(
        productDiscussionService.getProductDiscussionReplyById(replyId)
    );
  }

  @PatchMapping("/{replyId}")
  ResponseEntity<ProductDiscussionRepliesResponseDto> partialUpdateProductDiscussion(
      @PathVariable String replyId,
      @RequestBody ProductDiscussionUpdateRequestDto requestDto
  ) {
    return ResponseEntity.status(HttpStatus.ACCEPTED).body(
        productDiscussionService.partialUpdateProductDiscussionReply(replyId, requestDto)
    );
  }

  @DeleteMapping("/{replyId}")
  ResponseEntity<Void> deleteProductDiscussion(
      @PathVariable String replyId
  ) {
    productDiscussionService.deleteProductDiscussion(replyId);
    return ResponseEntity.noContent().build();
  }

}
