package com.omeracar.eshop.utils;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms}")
    private long jwtExpirationMs;

    private SecretKey key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public String generateTokenFromUsername(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .subject(username)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key(), SignatureAlgorithm.HS512)
                .compact();
    }

    public String generateToken(Authentication authentication) {

        Object principal = authentication.getPrincipal();
        UserDetails userPrincipal;

        if (principal instanceof UserDetails) {
            userPrincipal = (UserDetails) principal;
        } else {
            logger.warn("Authentication principal UserDetails değil, sadece username kullanılacak.");
            String username = authentication.getName();
            return generateTokenFromUsername(username);
        }

        String username = userPrincipal.getUsername();
        List<String> roles = userPrincipal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .subject(username)
                .claim("roles", roles)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key(), SignatureAlgorithm.HS512)
                .compact();
    }

    public String getUsernameFromJWT(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject();
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().verifyWith(key()).build().parseSignedClaims(authToken);
            return true;
        } catch (MalformedJwtException ex) {
            logger.error("Geçersiz JWT token formatı");
        } catch (ExpiredJwtException ex) {
            logger.error("JWT token süresi dolmuş");
        } catch (UnsupportedJwtException ex) {
            logger.error("Desteklenmeyen JWT token");
        } catch (IllegalArgumentException ex) {
            logger.error("JWT claims string boş");
        } catch (JwtException ex) { // Diğer tüm JWT hataları için
            logger.error("JWT hatası: {}", ex.getMessage());
        }
        return false;
    }

    @SuppressWarnings("unchecked")
    public List<String> getRolesFromJWT(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        Object rolesClaim = claims.get("roles");
        if (rolesClaim instanceof List) {
            try {
                return (List<String>) rolesClaim;
            } catch (ClassCastException e) {
                logger.error("Token içindeki 'roles' claim'i List<String> formatında değil.", e);
                return List.of();
            }
        }
        logger.warn("Token içinde 'roles' claim'i bulunamadı veya Liste değil.");
        return List.of();

    }
}