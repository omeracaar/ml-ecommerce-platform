package com.omeracar.eshop.service.impl;

import com.omeracar.eshop.dto.user.AuthResponseDto;
import com.omeracar.eshop.dto.user.LoginRequestDto;
import com.omeracar.eshop.dto.user.RegisterRequestDto;
import com.omeracar.eshop.dto.user.UserResponseDto;
import com.omeracar.eshop.exception.BadRequestException;
import com.omeracar.eshop.model.Cart;
import com.omeracar.eshop.model.User;
import com.omeracar.eshop.model.enums.UserRole;
import com.omeracar.eshop.repository.CartRepository;
import com.omeracar.eshop.repository.UserRepository;
import com.omeracar.eshop.service.IAuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.omeracar.eshop.utils.JwtTokenProvider;

import java.util.UUID;

@Service
public class AuthServiceImpl implements IAuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired(required = false)
    private CartRepository cartRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

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
    @Transactional
    public UserResponseDto registerUser(RegisterRequestDto registerRequestDto) {
        if (userRepository.findByUsername(registerRequestDto.getUsername()).isPresent()){
            throw new BadRequestException("Username "+registerRequestDto.getUsername()+" is already taken");
        }

        if (userRepository.findByEmail(registerRequestDto.getEmail()).isPresent()){
            throw new BadRequestException("Email "+registerRequestDto.getEmail()+" already taken");
        }

        User newUser=new User();
        newUser.setId(UUID.randomUUID().toString());
        newUser.setUsername(registerRequestDto.getUsername());
        newUser.setEmail(registerRequestDto.getEmail());
        newUser.setPassword(passwordEncoder.encode(registerRequestDto.getPassword()));
        newUser.setRole(UserRole.USER);
        newUser.setFirstName(registerRequestDto.getFirstName());
        newUser.setLastName(registerRequestDto.getLastName());
        newUser.setPhoneNumber(registerRequestDto.getPhoneNumber());
        newUser.setAddress(registerRequestDto.getAddress());

        User savedUser=userRepository.save(newUser);

        if (cartRepository!=null){
            Cart cart=new Cart();
            cart.setUser(savedUser);
            cartRepository.save(cart);
        }

        return convertToUserResponseDto(savedUser);
    }

    @Override
    public AuthResponseDto loginUser(LoginRequestDto loginDto) {
        logger.info("loginUser metodu başladı. Kullanıcı adı: {}", loginDto.getUsername());
        try {
            logger.debug("AuthenticationManager.authenticate çağrılacak...");
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginDto.getUsername(),
                            loginDto.getPassword()
                    )
            );
            logger.info("AuthenticationManager.authenticate BAŞARILI.");

            SecurityContextHolder.getContext().setAuthentication(authentication);
            logger.debug("SecurityContext'e authentication set edildi.");

            logger.debug("JwtTokenProvider.generateToken çağrılacak...");
            String jwt = jwtTokenProvider.generateToken(authentication);
            logger.info("JWT başarıyla oluşturuldu.");

            String username;
            if (authentication.getPrincipal() instanceof UserDetails userDetails) {
                username = userDetails.getUsername();
            } else if (authentication.getPrincipal() instanceof String s) {
                username = s; // Örn: anonymous kullanıcı string olabilir
            } else {
                username = loginDto.getUsername();
                logger.warn("Principal UserDetails değil, fallback loginDto kullanıldı: {}", username);
            }

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> {
                        logger.error("Authentication başarılı ama user DB'de bulunamadı? Username: {}", username);
                        return new UsernameNotFoundException("Login sonrası kullanıcı bulunamadı");
                    });
            logger.debug("Kullanıcı DB'den bulundu. ID: {}", user.getId());

            AuthResponseDto responseDto = new AuthResponseDto(jwt, "Bearer ", user.getId(), user.getUsername());
            logger.info("AuthResponseDto oluşturuldu. Login başarılı.");
            return responseDto;

        } catch (BadCredentialsException e) {
            logger.warn("BadCredentialsException yakalandı (Yanlış Şifre/Kullanıcı adı): {}", e.getMessage());
            throw new BadRequestException("Geçersiz kullanıcı adı veya şifre.");
        } catch (StackOverflowError e) {
            logger.error("!!! StackOverflowError loginUser içinde yakalandı !!!", e);
            throw new RuntimeException("Giriş sırasında kritik bir hata oluştu: StackOverflowError");
        } catch (Exception e) {
            logger.error("loginUser içinde BEKLENMEDİK HATA oluştu!", e);
            throw new RuntimeException("Giriş sırasında genel bir hata oluştu. Detaylar loglandı.");
        }
    }
}
