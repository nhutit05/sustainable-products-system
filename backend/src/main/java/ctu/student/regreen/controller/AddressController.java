package ctu.student.regreen.controller;

import ctu.student.regreen.dto.request.AddressRequest;
import ctu.student.regreen.dto.response.AddressResponse;
import ctu.student.regreen.service.interfaces.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@CrossOrigin
@RequiredArgsConstructor
public class AddressController {

    private final AddressService service;

    // [GET] /api/addresses
    @GetMapping
    public List<AddressResponse> getAllAddresses() {
        return service.getAll();
    }

    // [GET] /api/addresses/{id}
    @GetMapping("/{id}")
    public AddressResponse getAddressById(@PathVariable Integer id) {
        return service.getsByAddressId(id);
    }

    // [GET] /api/addresses?customerId={customerId}
    @GetMapping(params = "customerId")
    public List<AddressResponse> getAllAddressesByCustomerId(@RequestParam Integer customerId) {
        return service.getAllByCustomerId(customerId);
    }
    // [GET] /api/addresses?villageId={villageId}
    @GetMapping(params = "villageId")
    public List<AddressResponse> getAllAddressesByVillageId(@RequestParam Integer villageId)
    {
        return service.getAllByVillageId(villageId);
    }

    // [GET] /api/addresses/count
    @GetMapping("/count")
    public Integer countAddresses() {
        return service.count();
    }

    // [POST] /api/addresses
    @PostMapping
    public AddressResponse createAddress(@RequestBody AddressRequest address) {
        return service.create(address);
    }

    // PUT] /api/addresses/{id}
    @PutMapping("{id}")
    public AddressResponse updateAddress(@PathVariable Integer id, @RequestBody AddressRequest address) {
        return service.update(id, address);
    }

    // [DELETE] /api/addresses/{id}
    @DeleteMapping("{id}")
    public void deleteAddress(@PathVariable Integer id) {
        service.delete(id);
    }

}
