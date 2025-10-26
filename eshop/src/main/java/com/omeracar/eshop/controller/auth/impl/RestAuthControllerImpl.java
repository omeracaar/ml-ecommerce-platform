package com.omeracar.eshop.controller.auth.impl;


import com.omeracar.eshop.controller.RestBaseController;
import com.omeracar.eshop.controller.RootEntity;
import com.omeracar.eshop.controller.auth.IRestAuthController;
import com.omeracar.eshop.dto.user.AuthResponseDto;
import com.omeracar.eshop.dto.user.LoginRequestDto;
import com.omeracar.eshop.dto.user.RegisterRequestDto;
import com.omeracar.eshop.dto.user.UserResponseDto;
import com.omeracar.eshop.service.impl.AuthServiceImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rest/api/auth")
public class RestAuthControllerImpl extends RestBaseController implements IRestAuthController {

    @Autowired
    private AuthServiceImpl authService;

    @Override
    @PostMapping("/register")
    public ResponseEntity<RootEntity<UserResponseDto>> registerUser(
            @Valid @RequestBody RegisterRequestDto registerRequestDto) {
        UserResponseDto registeredUser=authService.registerUser(registerRequestDto);
        return created(registeredUser);
    }

    @Override
    @PostMapping("/login")
    public ResponseEntity<RootEntity<AuthResponseDto>> loginUser(
            @Valid @RequestBody LoginRequestDto loginDto) {
        AuthResponseDto authResponseDto=authService.loginUser(loginDto);
        return ok(authResponseDto);
    }

}
