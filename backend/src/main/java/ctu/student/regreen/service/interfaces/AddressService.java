package ctu.student.regreen.service.interfaces;

import ctu.student.regreen.dto.request.AddressRequest;
import ctu.student.regreen.dto.response.AddressResponse;
import ctu.student.regreen.model.Customer;

import java.util.List;


public interface AddressService {
    Customer getCurrentCustomer();

    List<AddressResponse> getMyAddresses();

    AddressResponse getsByAddressId(Integer id);

    AddressResponse create(AddressRequest address);

    AddressResponse update(Integer id, AddressRequest address);

    Boolean delete(Integer id);
}
