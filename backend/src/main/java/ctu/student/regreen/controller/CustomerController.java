package ctu.student.regreen.controller;

import ctu.student.regreen.dto.request.CustomerRequest;
import ctu.student.regreen.dto.request.LoginRequest;
import ctu.student.regreen.dto.response.CustomerResponse;
import ctu.student.regreen.service.interfaces.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService service;

    // [GET] /api/customers
    @GetMapping
    public List<CustomerResponse> getAllCustomers() {
        return service.getAll();
    }

    @GetMapping("me")
    public CustomerResponse getCustomerByUsername(@RequestParam(value = "username") String username) {
        return service.getByUsername(username);
    }

    // [GET] /api/customers/{id}
    @GetMapping("/{id}")
    public CustomerResponse getCustomerById(@PathVariable Integer id) {
        return service.getById(id);
    }

//    // [POST] /api/customers/auth
//    @PostMapping("/auth")
//    public CustomerResponse getCustomerByUsername(@RequestBody LoginRequest request) {
//        return service.getByUsername(request.getUsername(), request.getPassword());
//    }

    // [POST] /api/customers
    @PostMapping
    public CustomerResponse createCustomer(@RequestBody CustomerRequest request) {
        return service.create(request);
    }

    // [PUT] /api/customers/{id}
    @PutMapping("/{id}")
    public CustomerResponse updateCustomer(@PathVariable Integer id, @RequestBody CustomerRequest customer) {
        return service.update(id, customer);
    }

    // [DELETE] /api/customers/{id}
    @DeleteMapping("/{id}")
    public boolean deleteCustomer(@PathVariable Integer id) {
        return service.delete(id);
    }

}
