package ctu.student.regreen.controller;

import ctu.student.regreen.dto.request.CustomerRequest;
import ctu.student.regreen.dto.response.CustomerResponse;
import ctu.student.regreen.service.CustomerService;
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

    // [GET] /api/customers/{id}
    @GetMapping("{id}")
    public CustomerResponse getCustomerById(@PathVariable Integer id) {
        return service.getById(id);
    }

    // [POST] /api/customers
    @PostMapping
    public CustomerResponse createCustomer(@RequestBody CustomerRequest request) {
        return service.create(request);
    }

    // [PUT] /api/customers/{id}
    @PutMapping("{id}")
    public CustomerResponse updateCustomer(@PathVariable Integer id, @RequestBody CustomerRequest customer) {
        return service.update(id, customer);
    }

    // [DELETE] /api/customers/{id}
    @DeleteMapping("{id}")
    public boolean deleteCustomer(@PathVariable Integer id) {
        return service.delete(id);
    }

}
