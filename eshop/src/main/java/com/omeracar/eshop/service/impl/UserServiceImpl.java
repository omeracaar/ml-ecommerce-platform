package com.omeracar.eshop.service.impl;

import com.omeracar.eshop.dto.user.UserResponseDto;
import com.omeracar.eshop.exception.BadRequestException;
import com.omeracar.eshop.exception.ResourceNotFoundException;
import com.omeracar.eshop.model.User;
import com.omeracar.eshop.model.enums.UserRole;
import com.omeracar.eshop.repository.OrderRepository;
import com.omeracar.eshop.repository.UserRepository;
import com.omeracar.eshop.service.IUserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserServiceImpl implements IUserService {

    private static final Logger logger= LoggerFactory.getLogger(UserServiceImpl.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    private UserResponseDto convertToDto(User user){
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
    @Transactional(readOnly = true)
    public Page<UserResponseDto> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(this::convertToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserResponseDto> getUserById(String id) {
        return userRepository.findById(id)
                .map(this::convertToDto);
    }

    @Override
    @Transactional
    public UserResponseDto updateUserRole(String id, UserRole newRole) {



        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("role update basarisiz userId {} not found", id);
                    return new ResourceNotFoundException("User", "id", id);
                });

        //adminin kendi yetkisini dusurmesini engellemek icin
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        if (user.getUsername().equals(currentUsername)) {
            throw new BadRequestException("admin cannot self demotion");
        }

        user.setRole(newRole);
        User updatedUser=userRepository.save(user);
        logger.info("userId {} role basariyla guncellendi", id);

        return convertToDto(updatedUser);
    }

    @Override
    @Transactional
    public void deleteUser(String id) {

        if (!userRepository.existsById(id)){
            throw new ResourceNotFoundException("user","id",id);
        }

        //kullanicinin siparisinin olup olmadiginin kontrolu eger varsa silmeyecegim
        if (!orderRepository.findByUserIdOrderByOrderDateDesc(id).isEmpty()){
            throw new BadRequestException("this user cannot be deleted because user has order");
        }

        //eger siparis yoksa user entitydeki cascade all ile cart ve cartItemler de silinecek

        userRepository.deleteById(id);
    }
}
