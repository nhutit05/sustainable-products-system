package ctu.student.regreen.dto.response;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderResponse {

    public OrderResponse() {
        //TODO Auto-generated constructor stub
    }

    private Integer orderId;
    private LocalDateTime orderedAt;

    private String orderReceiver;
    private String orderReceiverPhone;
    private String orderAddress;

    private Integer customerId;
    private String customerUsername;

    private Integer paymentMethodId;
    private String paymentMethodName;

    private Integer voucherId;
    private String voucherCode;

    private Integer orderStatusId;
    private String orderStatusName;

    private Integer paymentStatusId;
    private String paymentStatusName;

    private Float totalAmount;

    private List<OrderItemResponse> items;
}