package ctu.student.regreen.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PaymentMethodRequest {
    @NotBlank(message = "Tên phương thức thanh toán không được trống")
    @Size(max = 50)
    private String paymentMethodName;
}