package ctu.student.regreen.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecentOrderResponse {

    private Integer orderId;
    private LocalDateTime orderedAt;
    private String customerUsername;
    private Float totalAmount;
    private String orderStatusName;
    private String paymentStatusName;
}
