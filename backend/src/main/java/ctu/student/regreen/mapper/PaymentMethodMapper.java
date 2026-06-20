package ctu.student.regreen.mapper;

import org.springframework.stereotype.Component;

import ctu.student.regreen.dto.request.PaymentMethodRequest;
import ctu.student.regreen.dto.response.PaymentMethodResponse;
import ctu.student.regreen.model.PaymentMethod;

@Component
public class PaymentMethodMapper {

    public PaymentMethodResponse toResponse(PaymentMethod e) {
        return new PaymentMethodResponse(
                e.getPaymentMethodId(),
                e.getPaymentMethodName(),
                e.getOnline()
        );
    }

    public PaymentMethod toEntity(PaymentMethodRequest r) {
        PaymentMethod e = new PaymentMethod();
        e.setPaymentMethodName(r.getPaymentMethodName());
        e.setOnline(r.getOnline());
        return e;
    }

    public void update(PaymentMethod e, PaymentMethodRequest r) {
        e.setPaymentMethodName(r.getPaymentMethodName());
        e.setOnline(r.getOnline());
    }
}