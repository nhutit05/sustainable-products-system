package ctu.student.regreen.service.implement;

import ctu.student.regreen.dto.request.AddressRequest;
import ctu.student.regreen.dto.response.AddressResponse;
import ctu.student.regreen.mapper.AddressMapper;
import ctu.student.regreen.model.Address;
import ctu.student.regreen.model.Customer;
import ctu.student.regreen.model.Village;
import ctu.student.regreen.repository.AddressRepository;
import ctu.student.regreen.repository.CustomerRepository;
import ctu.student.regreen.repository.VillageRepository;
import ctu.student.regreen.service.interfaces.AddressService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.math3.analysis.function.Add;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository repository;

    private final VillageRepository villageRepository;

    private final CustomerRepository customerRepository;

    private final AddressMapper addressMapper;

    @Override
    public Customer getCurrentCustomer() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        return customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    @Override
    public List<AddressResponse> getMyAddresses() {
        Customer customer = getCurrentCustomer();

        return repository.findByCustomerUserId(customer.getUserId())
                .stream()
                .map(addressMapper::toResponse)
                .toList();
    }

    @Override
    public AddressResponse getsByAddressId(Integer id) {
        Customer customer = getCurrentCustomer();

        Address address = repository.findById(id).orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getCustomer().getUserId().equals(customer.getUserId())) {
            throw new RuntimeException("Address does not belong to the current customer");
        }

        return addressMapper.toResponse(address);
    }

    @Override
    public AddressResponse create(AddressRequest address) {
        Customer customer = getCurrentCustomer();

        Village village = villageRepository.findById(address.getVillageId())
                .orElseThrow(() -> new RuntimeException("Village not found"));


        Address existingDefaultAddress = repository.findByIsDefaultAndCustomerUserId(true, customer.getUserId()).orElse(null);
        if (existingDefaultAddress != null && address.getIsDefault()) {
            existingDefaultAddress.setIsDefault(false);
            repository.save(existingDefaultAddress);
        }

        Address entity = addressMapper.toEntity(address, village, customer);
        return addressMapper.toResponse(repository.save(entity));
    }

    @Override
    public AddressResponse update(Integer id, AddressRequest address) {
        Customer customer = getCurrentCustomer();

        Address entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        Village village = villageRepository.findById(address.getVillageId())
                .orElseThrow(() -> new RuntimeException("Village not found"));

        if(address.getIsDefault() == true) {
            Address existingDefaultAddress = repository.findByIsDefaultAndCustomerUserId(true, customer.getUserId()).orElse(null);
            if (existingDefaultAddress != null && address.getIsDefault()) {
                existingDefaultAddress.setIsDefault(false);
                repository.save(existingDefaultAddress);
            }
        }

        addressMapper.update(entity, address, village, customer);
        return addressMapper.toResponse(repository.save(entity));
    }

    @Override
    public Boolean delete(Integer id) {
        Address entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        repository.delete(entity);
        return true;
    }
}

