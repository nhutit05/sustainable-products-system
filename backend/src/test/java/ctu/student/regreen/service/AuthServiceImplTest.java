package ctu.student.regreen.service;

import ctu.student.regreen.dto.request.GoogleLoginRequest;
import ctu.student.regreen.dto.request.LoginRequest;
import ctu.student.regreen.dto.request.RegisterRequest;
import ctu.student.regreen.dto.response.AuthResponse;
import ctu.student.regreen.exception.ErrorCode;
import ctu.student.regreen.exception.ResourceNotFoundException;
import ctu.student.regreen.model.Cart;
import ctu.student.regreen.model.Customer;
import ctu.student.regreen.repository.CartRepository;
import ctu.student.regreen.repository.CustomerRepository;
import ctu.student.regreen.repository.UserRepository;
import ctu.student.regreen.service.implement.AuthServiceImpl;
import ctu.student.regreen.service.implement.GoogleTokenVerifier;
import ctu.student.regreen.service.implement.JwtService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private CartRepository cartRepository;

    @Mock
    private GoogleTokenVerifier googleTokenVerifier;

    @InjectMocks
    private AuthServiceImpl service;

    private RegisterRequest registerRequest;

    private LoginRequest loginRequest;

    private Customer customer;

    @BeforeEach
    void setUp() {

        registerRequest = new RegisterRequest();
        registerRequest.setUsername("testuser");
        registerRequest.setPassword("Password1");
        registerRequest.setEmail("test@gmail.com");
        registerRequest.setNumberPhone("0123456789");
        registerRequest.setNationalId("012345678901");

        loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("Password1");

        customer = new Customer();
        customer.setUserId(1);
        customer.setUsername("testuser");
        customer.setEmail("test@gmail.com");
        customer.setPassword("encoded");
        customer.setIsActive(true);
    }

    // ==================== register ====================

    @Test
    void register_success() {

        when(userRepository.existsByUsername("testuser"))
                .thenReturn(false);

        when(passwordEncoder.encode("Password1"))
                .thenReturn("encoded");

        when(customerRepository.save(any(Customer.class)))
                .thenReturn(customer);

        when(jwtService.generateToken(any()))
                .thenReturn("jwt-token");

        AuthResponse result =
                service.register(registerRequest);

        assertNotNull(result);
        assertEquals("jwt-token", result.getToken());
        assertEquals("testuser", result.getUsername());
        assertEquals("ROLE_CUSTOMER", result.getRole());

        verify(userRepository).existsByUsername("testuser");
        verify(passwordEncoder).encode("Password1");
        verify(customerRepository).save(any(Customer.class));
        verify(cartRepository).save(any(Cart.class));
        verify(jwtService).generateToken(customer);
    }

    @Test
    void register_duplicateUsername_throwsException() {

        when(userRepository.existsByUsername("testuser"))
                .thenReturn(true);

        ResourceNotFoundException ex =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> service.register(registerRequest));

        assertEquals(
                ErrorCode.USERNAME_ALREADY_EXISTS,
                ex.getErrorCode());

        verify(customerRepository, never()).save(any());
        verify(cartRepository, never()).save(any());
    }

    // ==================== login ====================

    @Test
    void login_success() {

        when(userRepository.findByUsername("testuser"))
                .thenReturn(Optional.of(customer));

        when(passwordEncoder.matches("Password1", "encoded"))
                .thenReturn(true);

        when(jwtService.generateToken(customer))
                .thenReturn("jwt-token");

        AuthResponse result =
                service.login(loginRequest);

        assertNotNull(result);
        assertEquals("jwt-token", result.getToken());
        assertEquals("testuser", result.getUsername());
        assertEquals("ROLE_CUSTOMER", result.getRole());

        verify(userRepository).findByUsername("testuser");
        verify(passwordEncoder).matches("Password1", "encoded");
        verify(jwtService).generateToken(customer);
    }

    @Test
    void login_userNotFound_throwsException() {

        when(userRepository.findByUsername("testuser"))
                .thenReturn(Optional.empty());

        ResourceNotFoundException ex =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> service.login(loginRequest));

        assertEquals(ErrorCode.USER_NOT_FOUND, ex.getErrorCode());

        verify(passwordEncoder, never()).matches(any(), any());
        verify(jwtService, never()).generateToken(any());
    }

    @Test
    void login_wrongPassword_throwsException() {

        when(userRepository.findByUsername("testuser"))
                .thenReturn(Optional.of(customer));

        when(passwordEncoder.matches("Password1", "encoded"))
                .thenReturn(false);

        ResourceNotFoundException ex =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> service.login(loginRequest));

        assertEquals(ErrorCode.PASSWORD_INCORRECT, ex.getErrorCode());

        verify(jwtService, never()).generateToken(any());
    }

    @Test
    void login_accountLocked_throwsException() {

        customer.setIsActive(false);

        when(userRepository.findByUsername("testuser"))
                .thenReturn(Optional.of(customer));

        when(passwordEncoder.matches("Password1", "encoded"))
                .thenReturn(true);

        when(customerRepository.findByUsername("testuser"))
                .thenReturn(Optional.of(customer));

        ResourceNotFoundException ex =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> service.login(loginRequest));

        assertEquals(ErrorCode.ACCOUNT_LOCKED, ex.getErrorCode());

        verify(jwtService, never()).generateToken(any());
    }

    // ==================== googleLogin ====================

    @Test
    void googleLogin_newCustomer_success() {

        GoogleLoginRequest googleRequest = new GoogleLoginRequest();
        googleRequest.setCredential("google-credential");

        when(googleTokenVerifier.verify("google-credential"))
                .thenReturn(Map.of(
                        "email", "newuser@gmail.com",
                        "name", "New User",
                        "sub", "google-sub-123"));

        when(customerRepository.findByEmail("newuser@gmail.com"))
                .thenReturn(Optional.empty());

        Customer newCustomer = new Customer();
        newCustomer.setUserId(2);
        newCustomer.setEmail("newuser@gmail.com");
        newCustomer.setUsername("newuser");
        newCustomer.setPassword("encoded");

        when(passwordEncoder.encode(anyString()))
                .thenReturn("encoded");

        when(customerRepository.save(any(Customer.class)))
                .thenReturn(newCustomer);

        when(jwtService.generateToken(newCustomer))
                .thenReturn("google-jwt-token");

        AuthResponse result =
                service.googleLogin(googleRequest);

        assertNotNull(result);
        assertEquals("google-jwt-token", result.getToken());
        assertEquals("newuser", result.getUsername());

        verify(googleTokenVerifier).verify("google-credential");
        verify(customerRepository).findByEmail("newuser@gmail.com");
        verify(customerRepository).save(any(Customer.class));
        verify(cartRepository).save(any(Cart.class));
        verify(jwtService).generateToken(newCustomer);
    }

    @Test
    void googleLogin_existingCustomer_success() {

        GoogleLoginRequest googleRequest = new GoogleLoginRequest();
        googleRequest.setCredential("google-credential");

        when(googleTokenVerifier.verify("google-credential"))
                .thenReturn(Map.of(
                        "email", "test@gmail.com",
                        "name", "Test User",
                        "sub", "google-sub-456"));

        when(customerRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(customer));

        when(jwtService.generateToken(customer))
                .thenReturn("google-jwt-token");

        AuthResponse result =
                service.googleLogin(googleRequest);

        assertNotNull(result);
        assertEquals("google-jwt-token", result.getToken());
        assertEquals("testuser", result.getUsername());

        verify(googleTokenVerifier).verify("google-credential");
        verify(customerRepository).findByEmail("test@gmail.com");
        verify(customerRepository, never()).save(any());
        verify(cartRepository, never()).save(any());
        verify(jwtService).generateToken(customer);
    }

    @Test
    void googleLogin_accountLocked_throwsException() {

        customer.setIsActive(false);

        GoogleLoginRequest googleRequest = new GoogleLoginRequest();
        googleRequest.setCredential("google-credential");

        when(googleTokenVerifier.verify("google-credential"))
                .thenReturn(Map.of(
                        "email", "test@gmail.com",
                        "name", "Test User",
                        "sub", "google-sub-789"));

        when(customerRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(customer));

        ResourceNotFoundException ex =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> service.googleLogin(googleRequest));

        assertEquals(ErrorCode.ACCOUNT_LOCKED, ex.getErrorCode());

        verify(jwtService, never()).generateToken(any());
    }
}
