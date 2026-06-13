package ctu.student.regreen.service.implement;

import ctu.student.regreen.dto.request.CustomerRequest;
import ctu.student.regreen.dto.response.CustomerResponse;
import ctu.student.regreen.mapper.CustomerMapper;
import ctu.student.regreen.model.Customer;
import ctu.student.regreen.repository.CustomerRepository;
import ctu.student.regreen.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    public List<CustomerResponse> getAll() {
        return customerRepository.findAll()
                .stream()
                .map(CustomerMapper::toResponse)
                .toList();
    }

    public CustomerResponse getById(Integer id) {
        return customerRepository.findById(id)
                .map(CustomerMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    public CustomerResponse getByUsername(String username) {
        return customerRepository.findByUsername(username)
                .map(CustomerMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    public CustomerResponse getByEmail(String email) {
        return customerRepository.findByEmail(email)
                .map(CustomerMapper::toResponse)
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

        Customer customer = CustomerMapper.toEntity(request);

        customer.setPassword(
                passwordEncoder.encode(request.getPassword()));

        customer = customerRepository.save(customer);

        return CustomerMapper.toResponse(customer);
    }

    public CustomerResponse update(Integer id, CustomerRequest request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found by id: " + id));

        CustomerMapper.update(customer, request);
        customer.setPassword(
                passwordEncoder.encode(request.getPassword()));

        customer = customerRepository.save(customer);

        return CustomerMapper.toResponse(customer);
    }

    public Boolean delete(Integer id) {
        if (!customerRepository.existsById(id)) {
            throw new RuntimeException("Customer not found");
        }

        customerRepository.deleteById(id);
        return true;
    }
}
