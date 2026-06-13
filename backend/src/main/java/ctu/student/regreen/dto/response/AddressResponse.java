package ctu.student.regreen.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AddressResponse {

    private String addressName;
    private String addressStreet;
    private Integer villageId;
    private String userEmail;
}
