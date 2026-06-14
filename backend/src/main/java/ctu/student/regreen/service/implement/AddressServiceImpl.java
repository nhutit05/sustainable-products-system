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
    public List<AddressResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(addressMapper::toResponse)
                .toList();
    }

    @Override
    public List<AddressResponse> getAllByCustomerId(Integer customerId) {
        return repository.findAllByCustomerUserId(customerId)
                .stream()
                .map(addressMapper::toResponse)
                .toList();
    }

    public List<AddressResponse> getAllByVillageId(Integer villageId) {
        return repository.findAllByVillageVillageId(villageId)
                .stream()
                .map(addressMapper::toResponse)
                .toList();
    }

    @Override
    public AddressResponse getsByAddressId(Integer id) {
        return repository.findById(id)
                .map(addressMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Address not found"));
    }

    @Override
    public Integer count() {
        return repository.findAll().size();
    }

    @Override
    public AddressResponse create(AddressRequest address) {
        Village village = villageRepository.findById(address.getVillageId())
                .orElseThrow(() -> new RuntimeException("Village not found"));

        Customer customer = customerRepository.findById(address.getUserId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Address entity = addressMapper.toEntity(address, village, customer);
        return addressMapper.toResponse(repository.save(entity));
    }

    @Override
    public AddressResponse update(Integer id, AddressRequest address) {
        Address entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        Village village = villageRepository.findById(address.getVillageId())
                .orElseThrow(() -> new RuntimeException("Village not found"));

        Customer customer = customerRepository.findById(address.getUserId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

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

