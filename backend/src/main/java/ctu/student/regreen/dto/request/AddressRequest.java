package ctu.student.regreen.dto.request;

import lombok.Data;

@Data
public class AddressRequest {
    private String address_name;
    private String address_street;
    private Integer village_id;
    private Integer user_id;
}
