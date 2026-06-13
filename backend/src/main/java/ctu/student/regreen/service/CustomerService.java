package ctu.student.regreen.service;

import ctu.student.regreen.dto.request.CustomerRequest;
import ctu.student.regreen.dto.response.CustomerResponse;
import ctu.student.regreen.model.Customer;
import ctu.student.regreen.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


public interface CustomerService {
    CustomerResponse create(CustomerRequest request);

    List<CustomerResponse> getAll();

    CustomerResponse getById(Integer id);

    CustomerResponse getByUsername(String username);

    CustomerResponse getByEmail(String email);

    CustomerResponse update(Integer id, CustomerRequest request);

    Boolean delete(Integer id);
}
