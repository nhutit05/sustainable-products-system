package ctu.student.regreen.integration.payos.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PayOSCheckoutResult {

    private Long payOSOrderCode;

    private String checkoutUrl;

    private String qrCode;

    private LocalDateTime expiredAt;

}