package ctu.student.regreen.service.interfaces;

import ctu.student.regreen.dto.response.RefundSlipResponse;

import java.util.List;

public interface AdminRefundSlipService {

    List<RefundSlipResponse> getAllRefundSlips();

    RefundSlipResponse getRefundSlipById(
            Integer refundSlipId);

    RefundSlipResponse approveRefund(
            Integer refundSlipId);

    RefundSlipResponse rejectRefund(
            Integer refundSlipId);

    RefundSlipResponse markRefunded(
            Integer refundSlipId);
}