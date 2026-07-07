package ctu.student.regreen.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class OrderRequest {

    @NotBlank
    private String orderReceiver;

    @NotBlank
    @Pattern(regexp = "^[0-9]{10}$")
    private String orderReceiverPhone;

    private Integer addressId;

    @NotNull
    private Integer paymentMethodId;

    private Integer voucherId;

    @NotNull
    private List<Integer> productIds;
}