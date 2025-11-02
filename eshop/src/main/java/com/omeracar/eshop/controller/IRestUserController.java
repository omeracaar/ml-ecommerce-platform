package com.omeracar.eshop.controller;

import com.omeracar.eshop.dto.user.UpdateUserRoleRequestDto;
import com.omeracar.eshop.dto.user.UserResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

public interface IRestUserController {

    ResponseEntity<RootEntity<Page<UserResponseDto>>> getAllUsers(Pageable pageable);
    ResponseEntity<RootEntity<UserResponseDto>> getUserById(String id);
    ResponseEntity<RootEntity<UserResponseDto>> updateUserRole(String id, UpdateUserRoleRequestDto dto);
    ResponseEntity<RootEntity<Void>> deleteUser(String id);
}
