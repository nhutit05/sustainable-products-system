package ctu.student.regreen.controller;

import com.fasterxml.jackson.databind.ObjectMapper;

import ctu.student.regreen.config.JwtAuthenticationFilter;
import ctu.student.regreen.dto.request.LoginRequest;
import ctu.student.regreen.dto.request.RegisterRequest;
import ctu.student.regreen.dto.response.AuthResponse;
import ctu.student.regreen.service.implement.JwtService;
import ctu.student.regreen.service.interfaces.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

        @Autowired
        private MockMvc mockMvc;

        private final ObjectMapper objectMapper = new ObjectMapper();

        @MockitoBean
        private AuthService authService;

        @MockitoBean
        private JwtService jwtService;

        @MockitoBean
        private JwtAuthenticationFilter jwtAuthenticationFilter;

        @MockitoBean
        private UserDetailsService userDetailsService;

        @Test
        @DisplayName("Register success")
        void register_success() throws Exception {

                RegisterRequest request = new RegisterRequest();

                request.setUsername("nhut");
                request.setPassword("123456");
                request.setEmail("nhut@gmail.com");
                request.setNumberPhone("0123456789");

                AuthResponse response = new AuthResponse(
                                "jwt-token",
                                "nhut",
                                "CUSTOMER");

                when(authService.register(any(RegisterRequest.class)))
                                .thenReturn(response);

                mockMvc.perform(
                                post("/api/auth/register")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .content(
                                                                objectMapper.writeValueAsString(
                                                                                request)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.token")
                                                .value("jwt-token"))
                                .andExpect(jsonPath("$.username")
                                                .value("nhut"));
        }

      

        @Test
        void login_success() throws Exception {

                LoginRequest request = new LoginRequest();
                request.setUsername("nhut");
                request.setPassword("123456");

                AuthResponse response = new AuthResponse(
                                "jwt-token",
                                "nhut",
                                "CUSTOMER");

                when(authService.login(any(LoginRequest.class)))
                                .thenReturn(response);

                mockMvc.perform(post("/api/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.token").value("jwt-token"))
                                .andExpect(jsonPath("$.username").value("nhut"));
        }

        @Test
        @DisplayName("Register validation fail")
        void register_validation_fail() throws Exception {

                RegisterRequest request = new RegisterRequest();

                mockMvc.perform(
                                post("/api/auth/register")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .content(
                                                                objectMapper.writeValueAsString(
                                                                                request)))
                                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Test auth endpoint")
        void testAuth_success() throws Exception {

                mockMvc.perform(
                                get("/api/auth/test-auth"))
                                .andExpect(status().isOk())
                                .andExpect(content()
                                                .string("authenticated"));
        }

        @Test
        @DisplayName("Get current user info")
        void me_success() throws Exception {

                SecurityContextHolder.getContext()
                                .setAuthentication(
                                                new TestingAuthenticationToken(
                                                                "nhut",
                                                                null));

                mockMvc.perform(
                                get("/api/auth/me"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.username")
                                                .value("nhut"));
        }
}

// package ctu.student.regreen.controller;

// import com.fasterxml.jackson.databind.ObjectMapper;
// import ctu.student.regreen.dto.request.LoginRequest;
// import ctu.student.regreen.dto.request.RegisterRequest;
// import ctu.student.regreen.dto.response.AuthResponse;
// import ctu.student.regreen.service.interfaces.AuthService;

// import org.junit.jupiter.api.DisplayName;
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.AfterEach;

// import org.springframework.beans.factory.annotation.Autowired;
// import
// org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
// import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
// import org.springframework.http.MediaType;

// import
// org.springframework.security.authentication.TestingAuthenticationToken;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.test.context.bean.override.mockito.MockitoBean;
// import org.springframework.test.web.servlet.MockMvc;

// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.Mockito.*;

// import static
// org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
// import static
// org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// @WebMvcTest(AuthController.class)
// @AutoConfigureMockMvc(addFilters = false)
// class AuthControllerTest {

// @Autowired
// private MockMvc mockMvc;

// @Autowired
// private ObjectMapper objectMapper;

// @MockitoBean
// private AuthService authService;

// @AfterEach
// void tearDown() {
// SecurityContextHolder.clearContext();
// }

// // ================= REGISTER =================

// @Test
// @DisplayName("POST /register - success")
// void register_success() throws Exception {

// RegisterRequest req = new RegisterRequest();
// req.setUsername("nhut");
// req.setPassword("123456");
// req.setEmail("nhut@gmail.com");
// req.setNumberPhone("0123456789");

// AuthResponse res = new AuthResponse(
// "jwt-token",
// "nhut",
// "CUSTOMER"
// );

// when(authService.register(any(RegisterRequest.class)))
// .thenReturn(res);

// mockMvc.perform(post("/api/auth/register")
// .contentType(MediaType.APPLICATION_JSON)
// .content(objectMapper.writeValueAsString(req)))
// .andExpect(status().isOk())
// .andExpect(jsonPath("$.token").value("jwt-token"))
// .andExpect(jsonPath("$.username").value("nhut"))
// .andExpect(jsonPath("$.role").value("CUSTOMER"));

// verify(authService, times(1)).register(any(RegisterRequest.class));
// }

// @Test
// @DisplayName("POST /register - validation fail")
// void register_validation_fail() throws Exception {

// mockMvc.perform(post("/api/auth/register")
// .contentType(MediaType.APPLICATION_JSON)
// .content("{}"))
// .andExpect(status().isBadRequest());

// verifyNoInteractions(authService);
// }

// @Test
// @DisplayName("POST /register - service exception")
// void register_exception() throws Exception {

// RegisterRequest req = new RegisterRequest();
// req.setUsername("nhut");
// req.setPassword("123456");
// req.setEmail("nhut@gmail.com");
// req.setNumberPhone("0123456789");

// when(authService.register(any()))
// .thenThrow(new RuntimeException("Username exists"));

// mockMvc.perform(post("/api/auth/register")
// .contentType(MediaType.APPLICATION_JSON)
// .content(objectMapper.writeValueAsString(req)))
// .andExpect(status().is5xxServerError());

// verify(authService, times(1)).register(any());
// }

// // ================= LOGIN =================

// @Test
// @DisplayName("POST /login - success")
// void login_success() throws Exception {

// LoginRequest req = new LoginRequest();
// req.setUsername("nhut");
// req.setPassword("123456");

// AuthResponse res = new AuthResponse(
// "jwt-token",
// "nhut",
// "CUSTOMER"
// );

// when(authService.login(any(LoginRequest.class)))
// .thenReturn(res);

// mockMvc.perform(post("/api/auth/login")
// .contentType(MediaType.APPLICATION_JSON)
// .content(objectMapper.writeValueAsString(req)))
// .andExpect(status().isOk())
// .andExpect(jsonPath("$.token").value("jwt-token"))
// .andExpect(jsonPath("$.username").value("nhut"))
// .andExpect(jsonPath("$.role").value("CUSTOMER"));

// verify(authService, times(1)).login(any(LoginRequest.class));
// }

// @Test
// @DisplayName("POST /login - validation fail")
// void login_validation_fail() throws Exception {

// mockMvc.perform(post("/api/auth/login")
// .contentType(MediaType.APPLICATION_JSON)
// .content("{}"))
// .andExpect(status().isBadRequest());

// verifyNoInteractions(authService);
// }

// @Test
// @DisplayName("POST /login - service exception")
// void login_exception() throws Exception {

// LoginRequest req = new LoginRequest();
// req.setUsername("nhut");
// req.setPassword("123456");

// when(authService.login(any()))
// .thenThrow(new RuntimeException("Invalid credentials"));

// mockMvc.perform(post("/api/auth/login")
// .contentType(MediaType.APPLICATION_JSON)
// .content(objectMapper.writeValueAsString(req)))
// .andExpect(status().is5xxServerError());

// verify(authService, times(1)).login(any());
// }

// // ================= TEST AUTH =================

// @Test
// @DisplayName("GET /test-auth")
// void test_auth() throws Exception {

// mockMvc.perform(get("/api/auth/test-auth"))
// .andExpect(status().isOk())
// .andExpect(content().string("authenticated"));
// }

// // ================= ME =================

// @Test
// @DisplayName("GET /me - authenticated user")
// void me_authenticated() throws Exception {

// SecurityContextHolder.getContext().setAuthentication(
// new TestingAuthenticationToken(
// "nhut",
// null,
// "ROLE_USER"
// )
// );

// mockMvc.perform(get("/api/auth/me"))
// .andExpect(status().isOk())
// .andExpect(jsonPath("$.username").value("nhut"));
// }

// @Test
// @DisplayName("GET /me - anonymous user (current behavior)")
// void me_anonymous() throws Exception {

// SecurityContextHolder.clearContext();

// mockMvc.perform(get("/api/auth/me"))
// .andExpect(status().is5xxServerError());
// }
// }