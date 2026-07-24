package ctu.student.regreen.service.interfaces;

import ctu.student.regreen.dto.request.GoogleLoginRequest;
import ctu.student.regreen.dto.request.LoginRequest;
import ctu.student.regreen.dto.request.RegisterRequest;
import ctu.student.regreen.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse login(
            LoginRequest request);

    AuthResponse register(
            RegisterRequest request);

    AuthResponse googleLogin(GoogleLoginRequest request);
}