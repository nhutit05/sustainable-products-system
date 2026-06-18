package ctu.student.regreen.service.interfaces;

import ctu.student.regreen.dto.request.CustomerRequest;
import ctu.student.regreen.dto.response.CustomerResponse;
import ctu.student.regreen.model.Customer;

import java.util.List;


public interface CustomerService {
    CustomerResponse create(CustomerRequest request);

    List<CustomerResponse> getAll();

    CustomerResponse getById(Integer id);

    CustomerResponse getByUsername(String username);

    CustomerResponse getByEmail(String email, String password);

    CustomerResponse update(Integer id, CustomerRequest request);

    Boolean delete(Integer id);
}
