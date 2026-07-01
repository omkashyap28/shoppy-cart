package com.omkashyap.com.backend.service.impl;

import com.omkashyap.com.backend.dto.requestDto.AddressRequestDto;
import com.omkashyap.com.backend.dto.responseDto.AllAddressResponseDto;
import com.omkashyap.com.backend.dto.responseDto.UserAddressResponseDto;
import com.omkashyap.com.backend.dto.responseDto.UserResponseDto;
import com.omkashyap.com.backend.entity.Address;
import com.omkashyap.com.backend.entity.User;
import com.omkashyap.com.backend.repository.AddressRepository;
import com.omkashyap.com.backend.repository.UserRepository;
import com.omkashyap.com.backend.service.UserService;
import com.omkashyap.com.backend.type.GenderEnum;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;
  private final ModelMapper modelMapper;
  private final PasswordEncoder passwordEncoder;
  private final AddressRepository addressRepository;

  @Override
  public UserResponseDto getUserById(String userId) {
    User user = userRepository.findByUserId(userId).orElseThrow(() -> new IllegalArgumentException("User not exists"));
    UserResponseDto res = modelMapper.map(user, UserResponseDto.class);

    List<UserAddressResponseDto> addresses = user.getAddresses()
        .stream()
        .map(address -> modelMapper.map(address, UserAddressResponseDto.class))
        .toList();

    res.setAddresses(addresses);

    return res;
  }

  @Override
  @Transactional
  public UserResponseDto updatePartialUserDetails(String userId, Map<String, Object> updates) {
    User user = userRepository.findByUserId(userId)
        .orElseThrow(() -> new IllegalArgumentException("User not exits with this userid"));

    updates.forEach((key, value) -> {
      switch (key) {
        case "firstName":
          user.setFirstName((String) value);
          break;
        case "lastName":
          user.setLastName((String) value);
          break;
        case "email":
          user.setEmail((String) value);
          break;
        case "contact":
          user.setContact((String) value);
          break;
        case "avatarUrl":
          user.setAvatarUrl((String) value);
          break;
        case "fileId":
          user.setFileId((String) value);
          break;
        case "password":
          user.setPassword(passwordEncoder.encode((String) value));
          break;
        case "gender":
          GenderEnum existingGender = user.getGender();
          String valueInString = (String) value;
          if (existingGender == null) {
            GenderEnum gender = null;
            if (valueInString == "MALE") {
              gender = GenderEnum.MALE;
            } else if (valueInString == "FEMALE") {
              gender = GenderEnum.FEMALE;
            } else if (valueInString == "OTHER") {
              gender = GenderEnum.OTHER;
            }
            user.setGender(gender);
          }
          break;
        case "dateOfBirth":
          LocalDate existingDateOfBirth = user.getDateOfBirth();
          if (existingDateOfBirth == null) {
            user.setDateOfBirth((LocalDate) value);
          }
          break;
      }
      userRepository.save(user);
    });

    User updatedUser = userRepository.save(user);

    return modelMapper.map(updatedUser, UserResponseDto.class);
  }

  @Override
  @Transactional
  public void deleteUserById(String userId) {
    User user = userRepository.findByUserId(userId).orElseThrow(() -> new IllegalArgumentException("User not exists"));
    userRepository.delete(user);
  }

  @Override
  @Transactional
  public UserResponseDto addAddressToUser(String userId, AddressRequestDto addressRequestDto) {
    User user = userRepository.findByUserId(userId).orElseThrow(() -> new IllegalArgumentException("User not exsits"));

    Address address = new Address();
    address.setAddress(addressRequestDto.getAddress());
    address.setStreet(addressRequestDto.getStreet());
    address.setCity(addressRequestDto.getCity());
    address.setState(addressRequestDto.getState());
    address.setCountry(addressRequestDto.getCountry());
    address.setPostalCode(addressRequestDto.getPostalCode());

    address.setIsDefault(user.getAddresses().isEmpty());

    address.setUser(user);

    user.getAddresses().add(address);
    userRepository.save(user);

    UserResponseDto userResponseDto = modelMapper.map(user, UserResponseDto.class);

    userResponseDto.setUserId(user.getUserId());

    userResponseDto.setAddresses(
        user.getAddresses().stream()
            .map(add -> modelMapper.map(add, UserAddressResponseDto.class))
            .toList());

    return userResponseDto;
  }

  @Override
  public List<AllAddressResponseDto> getAllAddressByUserId(String userId) {
    List<Address> addresses = addressRepository.findByUser_UserId(userId);

    return addresses.stream()
        .map(add -> modelMapper.map(add, AllAddressResponseDto.class))
        .toList();
  }
}
