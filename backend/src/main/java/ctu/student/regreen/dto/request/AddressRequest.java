package ctu.student.regreen.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddressRequest {

    @NotBlank
    private String addressName;

    @NotBlank
    private String addressStreet;

    @NotBlank
    private Boolean isDefault = false;

    @NotBlank
    private Integer villageId;

    @NotBlank
    private Integer userId;
}
