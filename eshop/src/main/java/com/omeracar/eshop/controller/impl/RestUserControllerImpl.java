package com.omeracar.eshop.controller.impl;

import com.omeracar.eshop.controller.IRestUserController;
import com.omeracar.eshop.controller.RestBaseController;
import com.omeracar.eshop.controller.RootEntity;
import com.omeracar.eshop.dto.user.UpdateUserRoleRequestDto;
import com.omeracar.eshop.dto.user.UserResponseDto;
import com.omeracar.eshop.exception.ResourceNotFoundException;
import com.omeracar.eshop.service.impl.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/rest/api/admin/users")
public class RestUserControllerImpl extends RestBaseController implements IRestUserController {

    @Autowired
    private UserServiceImpl userService;

    @Override
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")//zaten /admin endpointi korumali fakat ekstra guvenlik
    public ResponseEntity<RootEntity<Page<UserResponseDto>>> getAllUsers(Pageable pageable) {
        Page<UserResponseDto> users=userService.getAllUsers(pageable);
        return ok(users);
    }

    @Override
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RootEntity<UserResponseDto>> getUserById(
            @PathVariable String id) {
        UserResponseDto userResponseDto=userService.getUserById(id)
                .orElseThrow(()-> new  ResourceNotFoundException("user","id",id));
        return ok(userResponseDto);
    }

    @Override
    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RootEntity<UserResponseDto>> updateUserRole(
            @PathVariable String id,
            @RequestBody UpdateUserRoleRequestDto dto) {
        UserResponseDto updatedUser=userService.updateUserRole(id,dto.getRole());
        return ok(updatedUser);
    }

    @Override
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RootEntity<Void>> deleteUser(
            @PathVariable String id) {
        userService.deleteUser(id);
        return noContent();
    }
}
