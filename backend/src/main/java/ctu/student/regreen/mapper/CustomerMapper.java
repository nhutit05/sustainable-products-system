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
        entity.setUsername(request.getUsername());
        entity.setNumberPhone(request.getNumberPhone());
        entity.setNationalId(request.getNationalId());
        if (request.getIsActive() != null) {
            entity.setIsActive(request.getIsActive());
        }

        return entity;
    }

    public CustomerResponse toResponse(Customer customer) {
        return new CustomerResponse(
                customer.getUserId(),
                customer.getUsername(),
                customer.getEmail(),
                customer.getNumberPhone(),
                customer.getNationalId(),
                customer.getAccumulatedEcoPoints(),
                customer.getIsActive()
        );
    }

    public void update(Customer customer, CustomerRequest request) {
        customer.setEmail(request.getEmail());
        customer.setUsername(request.getUsername());
        customer.setNumberPhone(request.getNumberPhone());
        customer.setNationalId(request.getNationalId());
        if (request.getIsActive() != null) {
            customer.setIsActive(request.getIsActive());
        }
    }
}
