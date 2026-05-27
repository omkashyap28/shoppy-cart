package com.omkashyap.com.backend.service.impl;

import com.omkashyap.com.backend.dto.requestDto.ProductRequestDto;
import com.omkashyap.com.backend.dto.responseDto.ProductResponseDto;
import com.omkashyap.com.backend.dtoMapper.ProductDtoMapper;
import com.omkashyap.com.backend.entity.*;
import com.omkashyap.com.backend.repository.*;
import com.omkashyap.com.backend.service.ProductService;
import com.omkashyap.com.backend.util.TagsUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

  private final ProductRepository productRepository;
  private final SellerRepository sellerRepository;
  private final ModelMapper modelMapper;
  private final CategoryRepository categoryRepository;
  private final ProductDtoMapper productDtoMapper;
  private final AffiliateCommissionRepository affiliateCommissionRepository;
  private final AffiliateUserProductRepository affiliateUserProductRepository;
  private final TagsRepository tagsRepository;
  private final TagsUtil tagsUtil;

  @Override
  @Transactional
  public ProductResponseDto addNewProduct(String sellerId, ProductRequestDto productRequestDto) {

    Seller seller = sellerRepository.findBySellerId(sellerId).orElseThrow();

    Category category = categoryRepository.findById(productRequestDto.getCategoryId()).orElseThrow(() ->
        new IllegalArgumentException("Category not found"));

    AffiliateCommission commission = affiliateCommissionRepository.findByCategoryName(category.getName()).orElseGet(
        () -> affiliateCommissionRepository.findByCategoryName(category.getParent().getName()).orElse(null)
    );

    Product product = Product.builder()
        .description(productRequestDto.getDescription())
        .category(category)
        .quantity(productRequestDto.getQuantity())
        .seller(seller)
        .averageRating(0.0F)
        .affiliateCommission(commission)
        .totalReviews(0)
        .price(productRequestDto.getPrice())
        .inStock(productRequestDto.getQuantity() != 0)
        .seller(seller)
        .build();

    productRequestDto.getTags().forEach(tag -> {
      Tags tags = tagsRepository.findByTagName(tag).orElseGet(() -> {
        Tags newTags = Tags.builder()
            .tagName(tag)
            .slug(tagsUtil.generateSlugByTagName(tag))
            .build();

        return tagsRepository.save(newTags);
      });

      product.getTags().add(tags);
    });

    productRepository.save(product);
    product.setProductUrl("product/" + product.getProductId());


    if (productRequestDto.getProductAttributes() != null) {

      if (product.getProductAttributes() == null) product.setProductAttributes(new ArrayList<>());

      productRequestDto.getProductAttributes().forEach(attrDto -> {
        ProductAttribute attribute = ProductAttribute.builder()
            .attributeName(attrDto.getAttributeName())
            .attributeValue(attrDto.getAttributeValue())
            .product(product)
            .build();

        product.getProductAttributes().add(attribute);
      });

    }

    if (product.getProductImages() == null) product.setProductImages(new ArrayList<>());

    if (productRequestDto.getProductImages() != null) {
      productRequestDto.getProductImages().forEach(imgDto -> {
        ProductImage image = ProductImage.builder()
            .imageUrl(imgDto.getImageUrl())
            .product(product)
            .build();

        product.getProductImages().add(image);
      });
    }

    seller.addProduct(product);


    return productDtoMapper.mapToDto(product);

  }

  @Override
  public ProductResponseDto getProductById(String productId, String refId) {
    Product product = productRepository.findByProductId(productId).orElseThrow(
        () -> new IllegalArgumentException("Product not exists with this id"));

    if (refId != null) {
      AffiliateUserProduct affiliateUserProduct = affiliateUserProductRepository.findByAffiliateUser_AffiliateCode(refId).orElse(null);

      if (affiliateUserProduct != null) {
        affiliateUserProduct.increaseClick();
        affiliateUserProductRepository.save(affiliateUserProduct);
      }
    }

    return productDtoMapper.mapToDto(product);
  }

  @Override
  public ProductResponseDto patchProductById(String sellerId, String productId, Map<String, Object> values) {
    Seller seller = sellerRepository.findBySellerId(sellerId).orElseThrow(() -> new IllegalArgumentException("Seller not exists"));
    Product product = productRepository.findByProductId(productId).orElseThrow(() -> new IllegalArgumentException("Product not exists with this id"));

    values.forEach((key, val) -> {
      switch (key) {
        case "description":
          product.setDescription((String) val);
          break;
        case "quantity":
          product.setQuantity((Integer) val);
          break;
        default:
          throw new IllegalArgumentException("Invalid field to update");
      }
    });

    return modelMapper.map(product, ProductResponseDto.class);
  }

  @Override
  public List<ProductResponseDto> getAllProducts(String sellerId) {

    Seller seller = sellerRepository.findBySellerId(sellerId).orElseThrow(() -> new IllegalArgumentException("Seller with this id not exists"));

    List<Product> products = productRepository.findAllBySeller(seller);

    return products
        .stream()
        .map(productDtoMapper::mapToDto)
        .toList();
  }

  @Override
  public void deleteProductBySellerId(String sellerId, String productId) {
    Product product = productRepository.findByProductId(productId).orElseThrow(() -> new RuntimeException("Product not found"));

    if (!product.getSeller().getSellerId().equals(sellerId)) {
      throw new IllegalArgumentException("You do not own this product");
    }

    productRepository.delete(product);

  }

  @Override
  public ProductResponseDto getProductBySellerAndProductId(String sellerId, String productId) {
    Seller seller = sellerRepository.findBySellerId(sellerId).orElseThrow(() -> new IllegalArgumentException("Seller not exists"));
    Product product = productRepository.findByProductId(productId).orElseThrow(() -> new IllegalArgumentException("Product not exists with this id"));

    return productDtoMapper.mapToDto(product);
  }

}
