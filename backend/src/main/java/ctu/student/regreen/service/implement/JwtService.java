package ctu.student.regreen.service.implement;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import ctu.student.regreen.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;


@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    public String generateToken(
            User user) {

        return Jwts.builder()
                .subject(
                        user.getUsername())
                .claim(
                        "role",
                        user.getRole())
                .issuedAt(
                        new Date())
                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + 86400000))
                .signWith(
                        getKey())
                .compact();
    }

    public String extractUsername(
            String token) {

        return extractClaims(token)
                .getSubject();
    }

    public String extractRole(
            String token) {

        return extractClaims(token)
                .get(
                        "role",
                        String.class);
    }

    private Claims extractClaims(
            String token) {

        return Jwts.parser()
                .verifyWith(
                        getKey())
                .build()
                .parseSignedClaims(
                        token)
                .getPayload();
    }

    private SecretKey getKey() {

        return Keys.hmacShaKeyFor(
                secret.getBytes());
    }
}
