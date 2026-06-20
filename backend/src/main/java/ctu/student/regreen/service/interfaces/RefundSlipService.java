package ctu.student.regreen.service.interfaces;

import ctu.student.regreen.dto.request.RefundSlipRequest;
import ctu.student.regreen.dto.response.RefundSlipResponse;

import java.util.List;

public interface RefundSlipService {

    RefundSlipResponse create(
            RefundSlipRequest request);

    RefundSlipResponse getById(
            Integer refundSlipId);

    RefundSlipResponse getByOrder(
            Integer orderId);

    List<RefundSlipResponse> getMyRefundSlips();
}