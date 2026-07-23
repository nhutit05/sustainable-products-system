package ctu.student.regreen.service.interfaces;

import ctu.student.regreen.dto.request.CustomerRequest;
import ctu.student.regreen.dto.response.CustomerResponse;
import java.util.List;


public interface CustomerService {
    CustomerResponse create(CustomerRequest request);

    List<CustomerResponse> getAll();

    CustomerResponse getById(Integer id);

    CustomerResponse getByUsername();

    CustomerResponse update(CustomerRequest request);

    Boolean delete(Integer id);
}
