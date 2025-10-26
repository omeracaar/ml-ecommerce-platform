package com.omeracar.eshop.controller.auth;

import com.omeracar.eshop.controller.RootEntity;
import com.omeracar.eshop.dto.user.AuthResponseDto;
import com.omeracar.eshop.dto.user.LoginRequestDto;
import com.omeracar.eshop.dto.user.RegisterRequestDto;
import com.omeracar.eshop.dto.user.UserResponseDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;

public interface IRestAuthController {

    ResponseEntity<RootEntity<UserResponseDto>> registerUser(RegisterRequestDto registerRequestDto);

    ResponseEntity<RootEntity<AuthResponseDto>> loginUser(LoginRequestDto loginDto);

}
