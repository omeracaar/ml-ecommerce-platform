package com.omeracar.eshop.dto.user;

import com.omeracar.eshop.model.enums.UserRole;
import lombok.Data;

@Data
public class UserResponseDto {

    private String id;
    private String username;
    private String email;
    private UserRole role;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String address;
}
