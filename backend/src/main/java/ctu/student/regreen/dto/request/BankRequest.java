package ctu.student.regreen.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BankRequest {

    @NotBlank
    private String bankId;
    @NotBlank
    private String bankShortName;
    private String bankName;
}
