package com.omkashyap.com.backend.service.impl;

import com.omkashyap.com.backend.dto.requestDto.ProductDiscussionRepliesRequestDto;
import com.omkashyap.com.backend.dto.requestDto.ProductDiscussionRequestDto;
import com.omkashyap.com.backend.dto.requestDto.ProductDiscussionUpdateRequestDto;
import com.omkashyap.com.backend.dto.responseDto.InfiniteScrollResponseDto;
import com.omkashyap.com.backend.dto.responseDto.ProductDiscussionRepliesResponseDto;
import com.omkashyap.com.backend.dto.responseDto.ProductDiscussionResponseDto;
import com.omkashyap.com.backend.dtoMapper.ProductDiscussionDtoMapper;
import com.omkashyap.com.backend.entity.Product;
import com.omkashyap.com.backend.entity.ProductDiscussion;
import com.omkashyap.com.backend.entity.User;
import com.omkashyap.com.backend.repository.ProductDiscussionRepository;
import com.omkashyap.com.backend.repository.ProductRepository;
import com.omkashyap.com.backend.repository.UserRepository;
import com.omkashyap.com.backend.service.ProductDiscussionService;
import com.omkashyap.com.backend.util.AuthHeaderUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductDiscussionServiceImpl implements ProductDiscussionService {

  private final ProductRepository productRepository;
  private final UserRepository userRepository;
  private final ProductDiscussionRepository productDiscussionRepository;
  private final ProductDiscussionDtoMapper productDiscussionDtoMapper;
  private final AuthHeaderUtil authHeaderUtil;

  @Override
  public ProductDiscussionResponseDto addDiscussionToProduct(
      String authHeader,
      String productId,
      ProductDiscussionRequestDto requestDto
  ) {
    Product product = productRepository.findByProductId(productId).orElseThrow(() ->
        new IllegalArgumentException("Product not exists"));

    String email = authHeaderUtil.getEmailFromAuthHeader(authHeader);
    User user = userRepository.findByEmail(email).orElseThrow(() ->
        new IllegalArgumentException("User not exists"));

    ProductDiscussion productDiscussion = ProductDiscussion.builder()
        .message(requestDto.getMessage())
        .user(user)
        .product(product)
        .build();

    productDiscussionRepository.save(productDiscussion);

    return productDiscussionDtoMapper.mapToDto(productDiscussion);
  }

  @Override
  public InfiniteScrollResponseDto<ProductDiscussionResponseDto>
  getAllProductDiscussions(
      String productId,
      Long cursor,
      int size
  ) {

    Pageable pageable = PageRequest.of(
        0,
        size,
        Sort.by(Sort.Direction.DESC, "id")
    );

    List<ProductDiscussion> productDiscussions;

    if (cursor == null) {

      productDiscussions =
          productDiscussionRepository
              .findAllByProduct_ProductId(
                  productId,
                  pageable
              );

    } else {

      productDiscussions =
          productDiscussionRepository
              .findAllByProduct_ProductIdAndIdLessThan(
                  productId,
                  cursor,
                  pageable
              );
    }

    List<ProductDiscussionResponseDto> content =
        productDiscussions.stream()
            .map(productDiscussionDtoMapper::mapToDto)
            .toList();

    Long nextCursor = null;
    boolean hasMore = false;

    if (!productDiscussions.isEmpty()) {

      ProductDiscussion lastDiscussion =
          productDiscussions.getLast();

      nextCursor = lastDiscussion.getId();

      hasMore = productDiscussions.size() == size;
    }

    return InfiniteScrollResponseDto
        .<ProductDiscussionResponseDto>builder()
        .content(content)
        .nextCursor(nextCursor)
        .hasMore(hasMore)
        .build();
  }

  @Override
  public ProductDiscussionResponseDto getProductDiscussionById(String discussionId) {
    ProductDiscussion productDiscussion = productDiscussionRepository.findByDiscussionId(discussionId).orElseThrow(() ->
        new IllegalArgumentException("Product discussion not available with this id"));

    return productDiscussionDtoMapper.mapToDto(productDiscussion);
  }

  @Override
  public ProductDiscussionResponseDto partialUpdateProductDiscussion(
      String discussionId,
      ProductDiscussionUpdateRequestDto requestDto
  ) {
    ProductDiscussion productDiscussion = productDiscussionRepository.findByDiscussionId(discussionId).orElseThrow(() ->
        new IllegalArgumentException("Product discussion not available with this id"));

    productDiscussion.setMessage(requestDto.getMessage());
    productDiscussion.setEdited(true);
    productDiscussionRepository.save(productDiscussion);

    return productDiscussionDtoMapper.mapToDto(productDiscussion);
  }

  @Override
  @Transactional
  public void deleteProductDiscussion(String discussionId) {
    productDiscussionRepository.deleteByDiscussionId(discussionId);
  }

  @Override
  public ProductDiscussionRepliesResponseDto addDiscussionReplyToProduct(
      String authHeader,
      String discussionId,
      ProductDiscussionRepliesRequestDto requestDto
  ) {
    ProductDiscussion productDiscussion = productDiscussionRepository.findByDiscussionId(discussionId).orElseThrow(() ->
        new IllegalArgumentException("Product discussion not available with this id"));
    String email = authHeaderUtil.getEmailFromAuthHeader(authHeader);
    User user = userRepository.findByEmail(email).orElseThrow(() ->
        new IllegalArgumentException("User not exists"));

    ProductDiscussion reply = ProductDiscussion.builder()
        .message(requestDto.getMessage())
        .user(user)
        .product(productDiscussion.getProduct())
        .parent(productDiscussion)
        .build();
    productDiscussionRepository.save(reply);

    return productDiscussionDtoMapper.mapToReplyDto(reply);
  }

  @Override
  public List<ProductDiscussionRepliesResponseDto> getAllProductDiscussionsReplies(String discussionId) {
    List<ProductDiscussion> replies = productDiscussionRepository.findRepliesByParentDiscussionId(discussionId);

    return replies.stream()
        .map(productDiscussionDtoMapper::mapToReplyDto)
        .toList();
  }

  @Override
  public ProductDiscussionRepliesResponseDto partialUpdateProductDiscussionReply(
      String discussionId,
      ProductDiscussionUpdateRequestDto requestDto
  ) {
    ProductDiscussion productDiscussion = productDiscussionRepository.findByDiscussionId(discussionId).orElseThrow(() ->
        new IllegalArgumentException("Product discussion not available with this id"));

    productDiscussion.setMessage(requestDto.getMessage());
    productDiscussion.setEdited(true);
    productDiscussionRepository.save(productDiscussion);

    return productDiscussionDtoMapper.mapToReplyDto(productDiscussion);
  }

  @Override
  public ProductDiscussionRepliesResponseDto getProductDiscussionReplyById(String discussionId) {
    ProductDiscussion productDiscussion = productDiscussionRepository.findByDiscussionId(discussionId).orElseThrow(() ->
        new IllegalArgumentException("Product discussion not available with this id"));

    return productDiscussionDtoMapper.mapToReplyDto(productDiscussion);
  }

  @Override
  public InfiniteScrollResponseDto<ProductDiscussionResponseDto> getAllDiscussionByUser(
      String authHeader,
      Long cursor,
      int size
  ) {

    String email = authHeaderUtil.getEmailFromAuthHeader(authHeader);

    Pageable pageable = PageRequest.of(
        0,
        size,
        Sort.by(Sort.Direction.DESC, "id")
    );

    List<ProductDiscussion> productDiscussions;

    if (cursor == null) {
      productDiscussions =
          productDiscussionRepository.findAllByUser_Email(
              email,
              pageable
          );
    } else {
      productDiscussions =
          productDiscussionRepository.findAllByUser_EmailAndIdLessThan(
              email,
              cursor,
              pageable
          );
    }

    List<ProductDiscussionResponseDto> content = productDiscussions.stream()
        .map(productDiscussionDtoMapper::mapToDto)
        .toList();

    Long nextCursor = null;
    boolean hasMore = false;

    if (!productDiscussions.isEmpty()) {

      ProductDiscussion lastDiscussion =
          productDiscussions.getLast();

      nextCursor = lastDiscussion.getId();

      hasMore = productDiscussions.size() == size;
    }

    return InfiniteScrollResponseDto.<ProductDiscussionResponseDto>builder()
        .content(content)
        .nextCursor(nextCursor)
        .hasMore(hasMore)
        .build();
  }

  @Override
  public List<ProductDiscussionResponseDto> getProductLimitedDiscussions(
      String productId,
      int limit
  ) {
    Product product = productRepository.findByProductId(productId).orElseThrow(() ->
        new IllegalArgumentException("Product not exists"));
    List<ProductDiscussion> productDiscussions = productDiscussionRepository.findRandomLimitedByProduct(
        product.getId(),
        Math.min(limit, 10)
    );

    return productDiscussions.stream()
        .map(productDiscussionDtoMapper::mapToDto)
        .toList();
  }
}
