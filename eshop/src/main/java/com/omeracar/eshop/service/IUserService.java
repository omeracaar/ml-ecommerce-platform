package com.omeracar.eshop.service;

import com.omeracar.eshop.dto.user.UserResponseDto;
import com.omeracar.eshop.model.enums.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

public interface IUserService {

    Page<UserResponseDto> getAllUsers(Pageable pageable);
    Optional<UserResponseDto> getUserById(String id);
    UserResponseDto updateUserRole(String id, UserRole newRole);
    void deleteUser(String id);
}
