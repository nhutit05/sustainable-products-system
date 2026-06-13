package ctu.student.regreen.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class InvoiceResponse {

    private Integer invoiceId;

    private LocalDateTime createdAt;

    private Integer orderId;

    private String orderReceiver;

    private String orderReceiverPhone;

    private Float totalAmount;
}