package ctu.student.regreen.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InvoiceRequest {

    @NotNull
    private Integer orderId;
}