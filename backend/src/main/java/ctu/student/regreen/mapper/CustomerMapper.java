package ctu.student.regreen.mapper;

import ctu.student.regreen.dto.request.CustomerRequest;
import ctu.student.regreen.dto.response.CustomerResponse;
import ctu.student.regreen.model.Customer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class CustomerMapper {

    public Customer toEntity(CustomerRequest request) {
        Customer entity = new Customer();

        entity.setEmail(request.getEmail());
        entity.setPassword(request.getPassword());
        entity.setUsername(request.getUsername());
        entity.setNumberPhone(request.getNumberPhone());
        entity.setNationalId(request.getNationalId());
        entity.setAccumulatedEcoPoints(request.getAccumulatedEcoPoints());

        return entity;
    }

    public CustomerResponse toResponse(Customer customer) {
        return new CustomerResponse(
                customer.getUserId(),
                customer.getEmail(),
                customer.getUsername(),
                customer.getNumberPhone(),
                customer.getNationalId(),
                customer.getAccumulatedEcoPoints()
        );
    }

    public void update(Customer customer, CustomerRequest request) {
        customer.setEmail(request.getEmail());
        customer.setUsername(request.getUsername());
        customer.setNumberPhone(request.getNumberPhone());
        customer.setNationalId(request.getNationalId());
        customer.setAccumulatedEcoPoints(request.getAccumulatedEcoPoints());
    }
}
