package ctu.student.regreen.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaymentStatusRequest {

    @NotBlank(message = "Tên trạng thái thanh toán không được rỗng")
    @Size(max = 50)
    private String paymentStatusName;
}
