package ctu.student.regreen.mapper;

import org.springframework.stereotype.Component;
import ctu.student.regreen.model.PaymentStatus;
import ctu.student.regreen.dto.request.PaymentStatusRequest;
import ctu.student.regreen.dto.response.PaymentStatusResponse;

@Component
public class PaymentStatusMapper {

    public PaymentStatus toEntity(PaymentStatusRequest request) {
        PaymentStatus ps = new PaymentStatus();
        ps.setPaymentStatusName(request.getPaymentStatusName());
        return ps;
    }

    public PaymentStatusResponse toResponse(PaymentStatus entity) {
        return new PaymentStatusResponse(
                entity.getPaymentStatusId(),
                entity.getPaymentStatusName()
        );
    }
}