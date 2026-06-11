package ctu.student.regreen.service.interfaces;

import java.util.List;

import ctu.student.regreen.dto.request.PaymentStatusRequest;
import ctu.student.regreen.dto.response.PaymentStatusResponse;

public interface PaymentStatusService {
    PaymentStatusResponse create(PaymentStatusRequest request);

    PaymentStatusResponse getById(Integer id);

    List<PaymentStatusResponse> getAll();

    PaymentStatusResponse update(Integer id, PaymentStatusRequest request);

    void delete(Integer id);
}