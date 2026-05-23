package com.omkashyap.com.backend.controller;

import com.omkashyap.com.backend.dto.requestDto.ProductDiscussionRequestDto;
import com.omkashyap.com.backend.dto.requestDto.ProductDiscussionUpdateRequestDto;
import com.omkashyap.com.backend.dto.responseDto.InfiniteScrollResponseDto;
import com.omkashyap.com.backend.dto.responseDto.ProductDiscussionResponseDto;
import com.omkashyap.com.backend.service.ProductDiscussionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/product/{productId}/discussions")
public class ProductDiscussionController {

  private final ProductDiscussionService productDiscussionService;

  @PostMapping
  ResponseEntity<ProductDiscussionResponseDto> addDiscussionToProduct(
      @RequestHeader("Authorization") String authHeader,
      @PathVariable String productId,
      @RequestBody ProductDiscussionRequestDto requestDto
  ) {
    return ResponseEntity.status(HttpStatus.CREATED).body(
        productDiscussionService.addDiscussionToProduct(authHeader, productId, requestDto)
    );
  }

  @GetMapping
  ResponseEntity<List<ProductDiscussionResponseDto>> getProductLimitedDiscussions(
      @PathVariable String productId,
      @RequestParam(value = "limit", required = false, defaultValue = "6") int limit
  ) {
    return ResponseEntity.status(HttpStatus.OK).body(
        productDiscussionService.getProductLimitedDiscussions(productId, limit)
    );
  }

  @GetMapping("/all")
  ResponseEntity<InfiniteScrollResponseDto<ProductDiscussionResponseDto>> getAllProductDiscussions(
      @PathVariable String productId,
      @RequestParam(value = "cursor", required = false) Long cursor,
      @RequestParam(value = "size", defaultValue = "10") int size
  ) {
    return ResponseEntity.status(HttpStatus.OK).body(
        productDiscussionService.getAllProductDiscussions(productId, cursor, size)
    );
  }

  @GetMapping("/{discussionId}")
  ResponseEntity<ProductDiscussionResponseDto> getProductDiscussionById(
      @PathVariable String discussionId
  ) {
    return ResponseEntity.status(HttpStatus.OK).body(
        productDiscussionService.getProductDiscussionById(discussionId)
    );
  }

  @PatchMapping("/{discussionId}")
  ResponseEntity<ProductDiscussionResponseDto> partialUpdateProductDiscussion(
      @PathVariable String discussionId,
      @RequestBody ProductDiscussionUpdateRequestDto requestDto
  ) {
    return ResponseEntity.status(HttpStatus.ACCEPTED).body(
        productDiscussionService.partialUpdateProductDiscussion(discussionId, requestDto)
    );
  }

  @DeleteMapping("/{discussionId}")
  ResponseEntity<Void> deleteProductDiscussion(
      @PathVariable String discussionId
  ) {
    productDiscussionService.deleteProductDiscussion(discussionId);
    return ResponseEntity.noContent().build();
  }

}
