package ctu.student.regreen.controller;

import ctu.student.regreen.model.Customer;
import ctu.student.regreen.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class CustomerController {

    @Autowired
    CustomerService service;

    // [GET] /api/customers
    @GetMapping
    public List<Customer> getAllCustomers() {
        return service.getAllCustomers();
    }

    // [GET] /api/customers/{id}
    @GetMapping("/{id}")
    public Customer getCustomerById(@PathVariable Integer id) {
        return service.getCustomerById(id);
    }

    // [POST] /api/customers
    @PostMapping
    public Customer createCustomer(@RequestBody Customer customer) {
        return service.createCustomer(customer);
    }
    // [POST] /api/customers/bulk
    @PostMapping("/bulk")
    public List<Customer> createCustomers(@RequestBody List<Customer> customers) {
        return service.createCustomers(customers);
    }

    // [PUT] /api/customers/{id}
    @PutMapping("/{id}")
    public Customer updateCustomer(@PathVariable Integer id, @RequestBody Customer customer) {
        return service.updateCustomer(id, customer);
    }

    // [DELETE] /api/customers/{id}
    @DeleteMapping("/{id}")
    public boolean deleteCustomer(@PathVariable Integer id) {
        return service.deleteCustomer(id);
    }

    // [DELETE] /api/customers
    @DeleteMapping
    public void deleteAllCustomers() {
        service.deleteAllCustomers();
    }
}
