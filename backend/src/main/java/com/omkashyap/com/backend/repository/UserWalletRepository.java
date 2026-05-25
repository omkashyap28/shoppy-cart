package com.omkashyap.com.backend.repository;

import com.omkashyap.com.backend.entity.UserWallet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserWalletRepository extends JpaRepository<UserWallet, Long> {

  Optional<UserWallet> findByUser_Email(String email);
}