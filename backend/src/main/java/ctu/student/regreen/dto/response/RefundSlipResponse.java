package ctu.student.regreen.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RefundSlipResponse {

    private Integer refundSlipId;

    private String bankNumber;

    private String accountBankName;

    private String reason;

    private Integer orderId;

    private String bankId;

    private String bankName;

    private Integer refundStatusId;

    private String refundStatusName;
}