package ctu.student.regreen.service;

import ctu.student.regreen.dto.request.LoginRequest;
import ctu.student.regreen.dto.request.RegisterRequest;
import ctu.student.regreen.dto.response.AuthResponse;
import ctu.student.regreen.exception.ResourceNotFoundException;
import ctu.student.regreen.model.Cart;
import ctu.student.regreen.model.Customer;
import ctu.student.regreen.model.User;
import ctu.student.regreen.repository.CartRepository;
import ctu.student.regreen.repository.CustomerRepository;
import ctu.student.regreen.repository.UserRepository;
import ctu.student.regreen.service.implement.AuthServiceImpl;
import ctu.student.regreen.service.implement.JwtService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.crypto.password.PasswordEncoder;

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

    @InjectMocks
    private AuthServiceImpl service;

    private RegisterRequest registerRequest;

    private LoginRequest loginRequest;

    private Customer customer;

    private User user;

    @BeforeEach
    void setUp() {

        registerRequest =
                new RegisterRequest();

        registerRequest.setUsername(
                "testuser");

        registerRequest.setPassword(
                "123456");

        registerRequest.setEmail(
                "test@gmail.com");

        registerRequest.setNumberPhone(
                "0123456789");

        loginRequest =
                new LoginRequest();

        loginRequest.setUsername(
                "testuser");

        loginRequest.setPassword(
                "123456");

        customer =
                new Customer();

        customer.setUserId(1);

        customer.setUsername(
                "testuser");

        customer.setPassword(
                "encoded");

        user =
                new Customer();

        user.setUsername(
                "testuser");

        user.setPassword(
                "encoded");
    }

    @Test
    void register_success() {

        when(userRepository.existsByUsername(
                "testuser"))
                .thenReturn(false);

        when(passwordEncoder.encode(
                "123456"))
                .thenReturn("encoded");

        when(customerRepository.save(any()))
                .thenReturn(customer);

        when(jwtService.generateToken(any()))
                .thenReturn("jwt-token");

        AuthResponse result =
                service.register(
                        registerRequest);

        assertNotNull(result);

        assertEquals(
                "jwt-token",
                result.getToken());

        verify(customerRepository)
                .save(any(Customer.class));

        verify(cartRepository)
                .save(any(Cart.class));
    }

    @Test
    void register_duplicateUsername_fail() {

        when(userRepository.existsByUsername(
                "testuser"))
                .thenReturn(true);

        RuntimeException ex =
                assertThrows(
                        RuntimeException.class,
                        () -> service.register(
                                registerRequest));

        assertEquals(
                "Username already exists",
                ex.getMessage());

        verify(customerRepository,
                never())
                .save(any());

        verify(cartRepository,
                never())
                .save(any());
    }

    @Test
    void login_success() {

        when(userRepository.findByUsername(
                "testuser"))
                .thenReturn(
                        Optional.of(user));

        when(passwordEncoder.matches(
                "123456",
                "encoded"))
                .thenReturn(true);

        when(jwtService.generateToken(
                user))
                .thenReturn(
                        "jwt-token");

        AuthResponse result =
                service.login(
                        loginRequest);

        assertNotNull(result);

        assertEquals(
                "jwt-token",
                result.getToken());

        assertEquals(
                "testuser",
                result.getUsername());
    }

    @Test
    void login_userNotFound_fail() {

        when(userRepository.findByUsername(
                "testuser"))
                .thenReturn(
                        Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> service.login(
                        loginRequest));
    }

    @Test
    void login_wrongPassword_fail() {

        when(userRepository.findByUsername(
                "testuser"))
                .thenReturn(
                        Optional.of(user));

        when(passwordEncoder.matches(
                "123456",
                "encoded"))
                .thenReturn(false);

        assertThrows(
                ResourceNotFoundException.class,
                () -> service.login(
                        loginRequest));
    }
}