package ctu.student.regreen.mapper;

import ctu.student.regreen.dto.request.AddressRequest;
import ctu.student.regreen.dto.response.AddressResponse;
import ctu.student.regreen.model.Address;
import ctu.student.regreen.model.Customer;
import ctu.student.regreen.model.Village;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AddressMapper {

    private final VillageMapper villageMapper;
    private final CustomerMapper customerMapper;

    public AddressResponse toResponse(Address address) {
        return new AddressResponse(
                address.getAddressId(),
                address.getAddressName(),
                address.getAddressStreet(),
                address.getIsDefault(),
                villageMapper.toResponse(address.getVillage()),
                customerMapper.toResponse(address.getCustomer())
        );
    }

    public Address toEntity(AddressRequest request,
                            Village village,
                            Customer customer) {
        Address entity = new Address();

        entity.setAddressName(request.getAddressName());
        entity.setAddressStreet(request.getAddressStreet());
        entity.setIsDefault(request.getIsDefault());

        entity.setVillage(village);
        entity.setCustomer(customer);

        return entity;
    }

    public void update(Address address,
                       AddressRequest request,
                       Village village,
                       Customer customer) {
        address.setAddressName(request.getAddressName());
        address.setAddressStreet(request.getAddressStreet());
        address.setIsDefault(request.getIsDefault());

        address.setVillage(village);
        address.setCustomer(customer);
    }

}
