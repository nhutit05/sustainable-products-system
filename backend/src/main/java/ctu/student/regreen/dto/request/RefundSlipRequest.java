package ctu.student.regreen.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RefundSlipRequest {

    @NotBlank
    @Pattern(regexp = "^[0-9]{6,20}$")
    private String bankNumber;

    @NotBlank
    private String accountBankName;

    @NotBlank
    private String reason;

    @NotNull
    private Integer orderId;

    @NotNull
    private String bankId;
}