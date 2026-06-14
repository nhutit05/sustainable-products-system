package ctu.student.regreen.service;

import ctu.student.regreen.dto.request.CustomerRequest;
import ctu.student.regreen.dto.response.CustomerResponse;
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
