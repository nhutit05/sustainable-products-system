package ctu.student.regreen.mapper;

import ctu.student.regreen.dto.request.AddressRequest;
import ctu.student.regreen.dto.response.AddressResponse;
import ctu.student.regreen.model.Address;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class AddressMapper {


    public static AddressResponse toResponse(Address address) {
        return new AddressResponse(
                address.getAddressName(),
                address.getAddressStreet(),
                address.getVillage().getVillageId(),
                address.getUser().getEmail()
        );
    }


}
