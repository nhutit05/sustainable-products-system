package ctu.student.regreen.service;

import ctu.student.regreen.dto.AddressRequest;
import ctu.student.regreen.model.Address;
import ctu.student.regreen.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressService {

    @Autowired
    AddressRepository repository;

    // [GET] /api/addresses
    public List<Address> getAllAddresses() {
        return repository.findAll();
    }

    // [GET] /api/addresses/{id}
    public Address getAddressById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    // [GET] /api/addresses/count
    public Integer countAddresses() {
        return (int) repository.count();
    }

    // [POST] /api/addresses
    public Address createAddress(AddressRequest address) {
        return null;
    }

    // [POST] /api/addresses/bulk
    public List<Address> createAddresses(List<Address> addresses) {
        return repository.saveAll(addresses);
    }

    // PUT] /api/addresses/{id}
    public Address updateAddress(Integer id, Address address) {
        Address existingAddress = repository.findById(id).orElse(null);
        if (existingAddress != null) {
            return repository.save(address);
        }
        return null;
    }

    // [DELETE] /api/addresses/{id}
    public boolean deleteAddress(Integer id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    // [DELETE] /api/addresses
    public void deleteAllAddresses() {
        repository.deleteAll();
    }
}
