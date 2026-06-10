package ctu.student.regreen.service;

import ctu.student.regreen.model.Customer;
import ctu.student.regreen.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    @Autowired
    CustomerRepository repository;

    // [GET] /api/customers
    public List<Customer> getAllCustomers() {
        return repository.findAll();
    }

    // [GET] /api/customers/{id}
    public Customer getCustomerById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    // [POST] /api/customers
    public Customer createCustomer(Customer customer) {
        return repository.save(customer);
    }

    // [POST] /api/customers/bulk
    public List<Customer> createCustomers(List<Customer> customers) {
        return repository.saveAll(customers);
    }

    // [PUT] /api/customers/{id}
    public Customer updateCustomer(Integer id, Customer customer) {
        Customer existingCustomer = repository.findById(id).orElse(null);
        if (existingCustomer != null) {
            return repository.save(existingCustomer);
        }
        return null;
    }

    // [DELETE] /api/customers/{id}
    public boolean deleteCustomer(Integer id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    // [DELETE] /api/customers
    public void deleteAllCustomers() {
        repository.deleteAll();
    }
}
