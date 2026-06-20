package ctu.student.regreen.service.implement;

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

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    private final CartRepository cartRepository;

 @Override
public AuthResponse register(RegisterRequest request) {

    if (userRepository.existsByUsername(request.getUsername())) {
        throw new RuntimeException("Username already exists");
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
                .orElseThrow(() -> new RuntimeException(
                        "User not found"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException(
                    "Invalid password");
        }

        String token = jwtService.generateToken(
                user);

        return new AuthResponse(
                token,
                user.getUsername(),
                user.getRole());
    }
}
