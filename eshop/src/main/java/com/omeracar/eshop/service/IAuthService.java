package com.omeracar.eshop.service;

import com.omeracar.eshop.dto.user.AuthResponseDto;
import com.omeracar.eshop.dto.user.LoginRequestDto;
import com.omeracar.eshop.dto.user.RegisterRequestDto;
import com.omeracar.eshop.dto.user.UserResponseDto;

public interface IAuthService {

    UserResponseDto registerUser(RegisterRequestDto registerRequestDto);

    AuthResponseDto loginUser(LoginRequestDto loginRequestDto);
}
