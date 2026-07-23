package ctu.student.regreen.service.implement;

import ctu.student.regreen.dto.request.CustomerRequest;
import ctu.student.regreen.dto.response.CustomerResponse;
import ctu.student.regreen.mapper.CustomerMapper;
import ctu.student.regreen.model.Cart;
import ctu.student.regreen.model.Customer;
import ctu.student.regreen.repository.CartRepository;
import ctu.student.regreen.repository.CustomerRepository;
import ctu.student.regreen.service.interfaces.CustomerService;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final CartRepository cartRepository;

    private final CustomerMapper customerMapper;

    private Customer getCurrentCustomer() {
        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        return customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    public List<CustomerResponse> getAll() {
        return customerRepository.findAll()
                .stream()
                .map(customerMapper::toResponse)
                .toList();
    }

    public CustomerResponse getById(Integer id) {
        return customerRepository.findById(id)
                .map(customerMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    public CustomerResponse getByUsername() {
        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        return customerRepository.findByUsername(username)
                .map(customerMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }


    public CustomerResponse create(CustomerRequest request) {
        if (customerRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (customerRepository.existsByNumberPhone(request.getNumberPhone())) {
            throw new RuntimeException("Phone number already exists");
        }

        Customer customer = customerMapper.toEntity(request);
        customer.setIsActive(true);

        Cart cart = new Cart();
        cart.setCustomer(customer);


        customer = customerRepository.save(customer);

        cart = cartRepository.save(cart);

        return customerMapper.toResponse(customer);
    }

    public CustomerResponse update(CustomerRequest request) {
        Customer customer = getCurrentCustomer();
        customerMapper.update(customer, request);

        customer = customerRepository.save(customer);

        return customerMapper.toResponse(customer);
    }

    public Boolean delete(Integer id) {
        if (!customerRepository.existsById(id)) {
            throw new RuntimeException("Customer not found");
        }

        customerRepository.deleteById(id);
        return true;
    }
}
