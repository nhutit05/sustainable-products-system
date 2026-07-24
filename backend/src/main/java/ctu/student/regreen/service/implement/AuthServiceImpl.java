package ctu.student.regreen.service.implement;

import ctu.student.regreen.dto.request.GoogleLoginRequest;
import ctu.student.regreen.exception.ErrorCode;
import ctu.student.regreen.exception.ResourceNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import ctu.student.regreen.dto.request.LoginRequest;
import ctu.student.regreen.dto.request.RegisterRequest;
import ctu.student.regreen.dto.response.AuthResponse;
import ctu.student.regreen.model.Cart;
import ctu.student.regreen.model.Customer;
import ctu.student.regreen.model.User;
import ctu.student.regreen.repository.CartRepository;
import ctu.student.regreen.repository.CustomerRepository;
import ctu.student.regreen.repository.UserRepository;
import ctu.student.regreen.service.interfaces.AuthService;
import lombok.RequiredArgsConstructor;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CartRepository cartRepository;
    private final GoogleTokenVerifier googleTokenVerifier;

 @Override
public AuthResponse register(RegisterRequest request) {

    if (userRepository.existsByUsername(request.getUsername())) {
        throw new ResourceNotFoundException(ErrorCode.USERNAME_ALREADY_EXISTS);
    }

    Customer customer = new Customer();

    customer.setUsername(request.getUsername());
    customer.setEmail(request.getEmail());
    customer.setNumberPhone(request.getNumberPhone());
    customer.setPassword(passwordEncoder.encode(request.getPassword()));

    // save customer trước
    customer = customerRepository.save(customer);

    // 🔥 CREATE CART AUTOMATICALLY
    Cart cart = new Cart();
    cart.setCustomer(customer);

    cartRepository.save(cart);

    String token = jwtService.generateToken(customer);

    return new AuthResponse(
            token,
            customer.getUsername(),
            customer.getRole()
    );
}
    @Override
    public AuthResponse login(
            LoginRequest request) {

        User user = userRepository
                .findByUsername(
                        request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new ResourceNotFoundException(ErrorCode.PASSWORD_INCORRECT);
        }

        customerRepository.findByUsername(user.getUsername())
                .filter(c -> Boolean.FALSE.equals(c.getIsActive()))
                .ifPresent(c -> { throw new ResourceNotFoundException(ErrorCode.ACCOUNT_LOCKED); });

        String token = jwtService.generateToken(
                user);

        return new AuthResponse(
                token,
                user.getUsername(),
                user.getRole());
    }

    @Override
    public AuthResponse googleLogin(GoogleLoginRequest request) {
        Map<String, String> googleUser = googleTokenVerifier.verify(request.getCredential());
        String email = googleUser.get("email");

        Customer customer = customerRepository.findByEmail(email).orElseGet(() -> {
            Customer newCustomer = new Customer();
            newCustomer.setEmail(email);
            newCustomer.setUsername(email.split("@")[0]);
            newCustomer.setNumberPhone("0000000000");
            newCustomer.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            newCustomer = customerRepository.save(newCustomer);

            Cart cart = new Cart();
            cart.setCustomer(newCustomer);
            cartRepository.save(cart);

            return newCustomer;
        });

        if (!customer.getIsActive()) {
            throw new ResourceNotFoundException(ErrorCode.ACCOUNT_LOCKED);
        }

        String token = jwtService.generateToken(customer);
        return new AuthResponse(token, customer.getUsername(), customer.getRole());
    }
}
