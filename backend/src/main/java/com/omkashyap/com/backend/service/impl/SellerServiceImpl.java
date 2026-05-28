package com.omkashyap.com.backend.service.impl;

import com.omkashyap.com.backend.dto.requestDto.AddressRequestDto;
import com.omkashyap.com.backend.dto.requestDto.SellerAccountRequestDto;
import com.omkashyap.com.backend.dto.requestDto.SellerRequestDto;
import com.omkashyap.com.backend.dto.requestDto.SellerVerificationRequestDto;
import com.omkashyap.com.backend.dto.responseDto.LoginResponseDto;
import com.omkashyap.com.backend.dto.responseDto.SellerResponseDto;
import com.omkashyap.com.backend.dto.responseDto.ShopAddressResponseDto;
import com.omkashyap.com.backend.entity.*;
import com.omkashyap.com.backend.repository.*;
import com.omkashyap.com.backend.service.SellerService;
import com.omkashyap.com.backend.type.CategoryEnum;
import com.omkashyap.com.backend.type.RoleEnum;
import com.omkashyap.com.backend.util.EmailUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SellerServiceImpl implements SellerService {

  private final SellerRepository sellerRepository;
  private final ModelMapper modelMapper;
  private final RoleRepository roleRepository;
  private final UserRepository userRepository;
  private final ShopAddressRepository shopAddressRepository;
  private final SellerVerificationRepository sellerVerificationRepository;
  private final SellerBankRepository sellerBankRepository;
  private final EmailUtil emailUtil;

  @Override
  @Transactional
  public SellerResponseDto updatePartialSellerDetails(String sellerId, Map<String, Object> updates) {
    Seller seller = sellerRepository.findBySellerId(sellerId).orElseThrow(() -> new IllegalArgumentException("Seller not exists with this id"));

    updates.forEach((key, value) -> {
      switch (key) {
        case "shopName":
          seller.setShopName((String) value);
          break;
        case "description":
          seller.setDescription((String) value);
          break;
        case "category":
          seller.setCategory((CategoryEnum) value);
          break;
        default:
          throw new IllegalArgumentException("Unsupported or not updatable column");
      }
    });

    sellerRepository.save(seller);

    return modelMapper.map(seller, SellerResponseDto.class);
  }

  @Override
  public SellerResponseDto registerSeller(SellerRequestDto requestDto) {

    if (sellerRepository.existsByUser_UserId(requestDto.getUserId())) {
      throw new IllegalArgumentException("Seller already exists");
    }

    User user = userRepository.findByUserId(requestDto.getUserId()).orElseThrow(() -> new IllegalArgumentException("USer not exists with this id"));
    Role role = roleRepository.findByRole(RoleEnum.ROLE_SELLER).orElseThrow(() -> new RuntimeException("Role not found"));

    Seller seller = Seller.builder()
        .user(user)
        .shopName(requestDto.getShopName())
        .description(requestDto.getDescription())
        .category(requestDto.getCategory())
        .averageRating(0.0F)
        .ratingCount(0)
        .isVerified(false)
        .build();

    if (user.getRoles() == null) {
      user.setRoles(new HashSet<>());
    }
    user.getRoles().add(role);

    Seller savedSeller = sellerRepository.save(seller);

    emailUtil.sendSellerWelcomeEmail(
        user.getEmail(),
        seller.getShopName(),
        seller.getSellerId()
    );

    return modelMapper.map(savedSeller, SellerResponseDto.class);
  }

  @Override
  public SellerResponseDto getSellerBySellerId(String sellerId) {
    Seller seller = sellerRepository.findBySellerId(sellerId).orElseThrow(() -> new IllegalArgumentException("Seller not exists with this id"));
    return modelMapper.map(seller, SellerResponseDto.class);
  }

  @Override
  public ShopAddressResponseDto addAddressBySellerId(String sellerId, AddressRequestDto addressRequestDto) {

    Seller seller = sellerRepository.findBySellerId(sellerId).orElseThrow(() -> new IllegalArgumentException("Seller not exists with this id"));

    boolean existing = shopAddressRepository.existsById(seller.getId());

    if (existing) {
      throw new IllegalArgumentException("Address with this seller already exists");
    }

    ShopAddress shopAddress = ShopAddress.builder()
        .address(addressRequestDto.getAddress())
        .street(addressRequestDto.getStreet())
        .city(addressRequestDto.getCity())
        .state(addressRequestDto.getState())
        .postalCode(addressRequestDto.getPostalCode())
        .seller(seller)
        .country(addressRequestDto.getCountry())
        .build();

    shopAddressRepository.save(shopAddress);

    seller.setShopAddress(shopAddress);

    return modelMapper.map(shopAddress, ShopAddressResponseDto.class);
  }

  @Override
  public ShopAddressResponseDto getSellerAddressBySellerId(String sellerId) {

    boolean isExists = sellerRepository.existsBySellerId(sellerId);

    if (!isExists) {
      throw new IllegalArgumentException("Seller with this id is not exists");
    }

    ShopAddress address = shopAddressRepository.findBySeller_SellerId(sellerId).orElseThrow(() -> new IllegalArgumentException("Address with this seller is not exists"));

    return modelMapper.map(address, ShopAddressResponseDto.class);
  }

  @Override
  public LoginResponseDto loginSeller(SellerRequestDto requestDto) {
    return null;
  }

  @Override
  @Transactional
  public SellerResponseDto addSellerVerification(String sellerId, SellerVerificationRequestDto requestDto) {
    Seller seller = sellerRepository.findBySellerId(sellerId).orElseThrow(() -> new IllegalArgumentException("Seller not exists with this id"));

    boolean isExisting = sellerVerificationRepository.existsBySeller_SellerId(sellerId);

    if (isExisting) throw new IllegalArgumentException("Seller already verified");

    SellerVerification sellerVerification = new SellerVerification();
    sellerVerification.setGstNo(requestDto.getGstNo());
    sellerVerification.setPanNo(requestDto.getPanNo());
    sellerVerification.setSeller(seller);

    seller.setIsVerified(true);
    seller.setSellerVerification(sellerVerification);

    sellerVerificationRepository.save(sellerVerification);
    Seller savedSeller = sellerRepository.save(seller);

    return modelMapper.map(savedSeller, SellerResponseDto.class);
  }

  @Override
  public SellerResponseDto addSellerAccountInfo(String sellerId, SellerAccountRequestDto requestDto) {
    Seller seller = sellerRepository.findBySellerId(sellerId).orElseThrow(() -> new IllegalArgumentException("Seller not exists"));

    boolean isExists = sellerBankRepository.existsBySeller_SellerId(sellerId);

    if (isExists) throw new IllegalArgumentException("Account details with this seller already exists");

    SellerBank sellerBank = new SellerBank();
    sellerBank.setAccountNo(requestDto.getAccountNo());
    sellerBank.setBankName(requestDto.getBankName());
    sellerBank.setIfscCode(requestDto.getIfscCode());
    sellerBank.setSeller(seller);

    sellerBankRepository.save(sellerBank);
    seller.setSellerBank(sellerBank);

    return modelMapper.map(seller, SellerResponseDto.class);
  }

  @Override
  @Transactional
  public void deleteSellerById(String sellerId) {
    boolean isExisting = sellerRepository.existsBySellerId(sellerId);

    if (!isExisting) throw new IllegalArgumentException("Seller not exists to delete");
    sellerRepository.deleteBySellerId(sellerId);

  }

}
