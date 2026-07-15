package ctu.student.regreen.mapper;

import ctu.student.regreen.dto.response.RefundSlipResponse;
import ctu.student.regreen.model.RefundSlip;
import org.springframework.stereotype.Component;

@Component
public class RefundSlipMapper {

    public RefundSlipResponse toResponse(
            RefundSlip refundSlip) {

        return new RefundSlipResponse(
                refundSlip.getRefundSlipId(),

                refundSlip.getBankNumber(),

                refundSlip.getAccountBankName(),

                refundSlip.getReason(),

                refundSlip.getOrder().getOrderId(),

                refundSlip.getBank().getBankId(),

                refundSlip.getBank().getBankName(),

                refundSlip.getRefundStatus().getRefundStatusId(),

                refundSlip.getRefundStatus().getRefundStatusName(),
                
                refundSlip.getCreatedAt(),
                refundSlip.getUpdatedAt()
        );
    }
}