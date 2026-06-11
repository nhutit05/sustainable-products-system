package ctu.student.regreen.service.interfaces;

import java.util.List;

import ctu.student.regreen.dto.request.PaymentMethodRequest;
import ctu.student.regreen.dto.response.PaymentMethodResponse;

public interface PaymentMethodService {
    PaymentMethodResponse create(PaymentMethodRequest request);
    List<PaymentMethodResponse> getAll();
    PaymentMethodResponse getById(Integer id);
    PaymentMethodResponse update(Integer id, PaymentMethodRequest request);
    void delete(Integer id);
}
