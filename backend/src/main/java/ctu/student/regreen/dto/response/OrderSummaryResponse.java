package ctu.student.regreen.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderSummaryResponse {

    private Integer orderId;

    private LocalDateTime orderedAt;

    // Customer
    private Integer customerId;
    private String customerUsername;

    // Payment Method
    private Integer paymentMethodId;
    private String paymentMethodName;

    // Payment Status
    private Integer paymentStatusId;
    private String paymentStatusName;

    // Order Status
    private Integer orderStatusId;
    private String orderStatusName;

    // Total
    private Float totalAmount;
}