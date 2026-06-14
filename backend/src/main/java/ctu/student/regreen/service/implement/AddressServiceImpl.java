package ctu.student.regreen.service.implement;

import ctu.student.regreen.dto.request.AddressRequest;
import ctu.student.regreen.dto.response.AddressResponse;
import ctu.student.regreen.mapper.AddressMapper;
import ctu.student.regreen.model.Address;
import ctu.student.regreen.repository.AddressRepository;
import ctu.student.regreen.service.interfaces.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository repository;
    private final AddressMapper addressMapper;

    @Override
    public List<AddressResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(addressMapper::toResponse)
                .toList();
    }

    public AddressResponse getsById(Integer id) {
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
        Address entity = addressMapper.toEntity(address);
        return addressMapper.toResponse(repository.save(entity));
    }

    @Override
    public AddressResponse update(Integer id, AddressRequest address) {
        Address entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        addressMapper.update(entity, address);
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

