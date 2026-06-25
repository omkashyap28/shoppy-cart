package com.omkashyap.com.backend.repository;

import com.omkashyap.com.backend.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {
  List<Address> findByUser_UserId(String userId);

  Optional<Address> findByUser_UserIdAndAddressId(String userId, String addressId);

  Optional<Address> findByAddressId(String addressId);

  void deleteByUser_UserIdAndAddressId(String userId, String addressId);

  @Modifying
  @Query("""
    UPDATE Address a
    SET a.isDefault=false
    WHERE a.user.userId=:userId
    """)
  void clearDefault(
      String userId
  );
}