package ctu.student.regreen.controller;

import ctu.student.regreen.model.Address;
import ctu.student.regreen.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@CrossOrigin
public class AddressController {

    @Autowired
    AddressService service;

    // [GET] /api/addresses
    @GetMapping
    public List<Address> getAllAddresses() {
        return service.getAllAddresses();
    }

    // [GET] /api/addresses/{id}
    @GetMapping("{id}")
    public Address getAddressById(@PathVariable Integer id) {
        return service.getAddressById(id);
    }

    // [GET] /api/addresses/count
    @GetMapping("/count")
    public Integer countAddresses() {
        return service.countAddresses();
    }

    // [POST] /api/addresses
    @PostMapping
    public void createAddress(@RequestBody Address address) {
        service.createAddress(address);
    }

    // [POST] /api/addresses/bulk
    @PostMapping("/bulk")
    public void createAddresses(@RequestBody List<Address> addresses) {
        service.createAddresses(addresses);
    }

    // PUT] /api/addresses/{id}
    @PutMapping("{id}")
    public void updateAddress(@PathVariable Integer id, @RequestBody Address address) {
        service.updateAddress(id, address);
    }

    // [DELETE] /api/addresses/{id}
    @DeleteMapping("{id}")
    public void deleteAddress(@PathVariable Integer id) {
        service.deleteAddress(id);
    }

    // [DELETE] /api/addresses
    @DeleteMapping
    public void deleteAllAddresses() {
        service.deleteAllAddresses();
    }
}
