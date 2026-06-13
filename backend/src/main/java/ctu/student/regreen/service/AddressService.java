package ctu.student.regreen.service;

import ctu.student.regreen.dto.request.AddressRequest;
import ctu.student.regreen.dto.response.AddressResponse;
import ctu.student.regreen.model.Address;
import ctu.student.regreen.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


public interface AddressService {
    List<AddressResponse> getAll();

    AddressResponse getsById(Integer id);

    Integer count();

    AddressResponse create(AddressRequest address);

    AddressResponse update(Integer id, AddressRequest address);

    Boolean delete(Integer id);
}
