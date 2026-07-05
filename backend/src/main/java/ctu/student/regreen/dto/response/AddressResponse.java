package ctu.student.regreen.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AddressResponse {
    private Integer addressId;

    private String addressName;

    private String addressStreet;

    private Boolean isDefault;

    private Integer villageId;
    private String villageName;

    private Integer cityId;
    private String cityName;

//    private CustomerResponse customer;
}
