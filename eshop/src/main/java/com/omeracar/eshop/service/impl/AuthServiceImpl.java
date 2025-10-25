package com.omeracar.eshop.service.impl;

import com.omeracar.eshop.dto.user.AuthResponseDto;
import com.omeracar.eshop.dto.user.LoginRequestDto;
import com.omeracar.eshop.dto.user.RegisterRequestDto;
import com.omeracar.eshop.dto.user.UserResponseDto;
import com.omeracar.eshop.model.User;
import com.omeracar.eshop.repository.CartRepository;
import com.omeracar.eshop.repository.UserRepository;
import com.omeracar.eshop.service.IAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements IAuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired(required = false)
    private CartRepository cartRepository;

    private UserResponseDto convertToUserResponseDto(User user){
        UserResponseDto dto=new UserResponseDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setAddress(user.getAddress());
        return dto;
    }

    @Override
    public UserResponseDto registerUser(RegisterRequestDto registerRequestDto) {
        return null;
    }

    @Override
    public AuthResponseDto loginUser(LoginRequestDto loginRequestDto) {
        return null;
    }
}
