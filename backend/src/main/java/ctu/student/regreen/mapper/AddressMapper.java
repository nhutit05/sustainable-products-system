package ctu.student.regreen.mapper;

import ctu.student.regreen.dto.request.AddressRequest;
import ctu.student.regreen.dto.response.AddressResponse;
import ctu.student.regreen.model.Address;
import ctu.student.regreen.model.Customer;
import ctu.student.regreen.model.Village;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class AddressMapper {


    public static AddressResponse toResponse(Address address) {
        return new AddressResponse(
                address.getAddressName(),
                address.getAddressStreet(),
                address.getIsDefault(),
                VillageMapper.toResponse(address.getVillage()),
                CustomerMapper.toResponse(address.getCustomer())
        );
    }

    public static Address toEntity(AddressRequest request) {
        Address entity = new Address();

        entity.setAddressName(request.getAddressName());
        entity.setAddressStreet(request.getAddressStreet());
        entity.setIsDefault(request.getIsDefault());
        entity.setVillage(VillageMapper.toEntity(request.getVillageRequest()));
        entity.setCustomer(CustomerMapper.toEntity(request.getCustomerRequest()));

        return entity;
    }

    public static void update(Address address, AddressRequest request) {
        address.setAddressName(request.getAddressName());
        address.setAddressStreet(request.getAddressStreet());
        address.setIsDefault(request.getIsDefault());
        address.setVillage(VillageMapper.toEntity(request.getVillageRequest()));
        address.setCustomer(CustomerMapper.toEntity(request.getCustomerRequest()));
    }

}
