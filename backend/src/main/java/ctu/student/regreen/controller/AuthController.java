package ctu.student.regreen.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ctu.student.regreen.dto.request.LoginRequest;
import ctu.student.regreen.dto.request.RegisterRequest;
import ctu.student.regreen.dto.response.AuthResponse;
import ctu.student.regreen.service.interfaces.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService service;

    @PostMapping("/register")
    public AuthResponse register(
            @Valid @RequestBody RegisterRequest request) {

        return service.register(
                request);
    }

    @PostMapping("/login")
    public AuthResponse login(
            @Valid @RequestBody LoginRequest request) {

        return service.login(
                request);
    }

    @GetMapping("/test-auth")

    public String testAuth() {
        return "authenticated";
    }

    @GetMapping("/me")
    public Object me() {

        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        return Map.of(
                "username",
                auth.getName(),
                "authorities",
                auth.getAuthorities());
    }
}