package ctu.student.regreen.service.interfaces;

import ctu.student.regreen.dto.request.AddressRequest;
import ctu.student.regreen.dto.response.AddressResponse;

import java.util.List;


public interface AddressService {
    List<AddressResponse> getAll();

    AddressResponse getsById(Integer id);

    Integer count();

    AddressResponse create(AddressRequest address);

    AddressResponse update(Integer id, AddressRequest address);

    Boolean delete(Integer id);
}
