package ctu.student.regreen.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class OrderStatusRequest {

    @NotBlank(message = "Tên trạng thái đơn hàng không được rỗng.")
    @Size(max = 50, message = "Tên trạng thái không được vượt quá 50 ký tự.")
    private String orderStatusName;
}