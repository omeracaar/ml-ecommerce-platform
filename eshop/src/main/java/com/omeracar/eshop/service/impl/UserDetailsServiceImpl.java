package com.omeracar.eshop.service.impl;

import com.omeracar.eshop.model.User;
import com.omeracar.eshop.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(UserDetailsServiceImpl.class);

    @Autowired
    private UserRepository userRepository;


    @Override
    // @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        logger.info("loadUserByUsername cagirildi. aranan username: {}", username);
        try {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> {
                        logger.warn("user bulunamadi: {}", username);
                        return new UsernameNotFoundException("User not found with username: " + username);
                    });
            logger.debug("user db de bulundu: {}", user.getUsername());

            if (user.getRole() == null) {
                logger.error("kullanici rolu null user id: {}", user.getId());
                throw new IllegalStateException("kullanici rolu null olamaz.");
            }
            logger.debug("kullanicinin rolu: {}", user.getRole().name());

            GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().name());
            Collection<GrantedAuthority> authorities = Collections.singletonList(authority);
            logger.debug("GrantedAuthority olsturuldu: {}", authority.getAuthority());

            if (user.getPassword() == null) {
                logger.error("kullanici sifresi null user id: {}", user.getId());
                throw new IllegalStateException("kullanici sifresi null olamaz");
            }

            UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                    user.getUsername(),
                    user.getPassword(),
                    authorities);
            logger.info("UserDetails nesnesi {} icin basariyla olusturuldu", username);
            return userDetails;

        } catch (UsernameNotFoundException e) {
            throw e;
        } catch (Exception e) {
            logger.error("loadUserByUsername içinde beklenmedik hata olustu", e);
            throw new RuntimeException("user yuklenirken hata: " + e.getMessage(), e);
        }
    }
}
