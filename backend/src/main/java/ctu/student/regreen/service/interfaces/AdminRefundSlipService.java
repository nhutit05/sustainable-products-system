package ctu.student.regreen.service.interfaces;

import ctu.student.regreen.dto.response.RefundSlipResponse;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminRefundSlipService {

//     List<RefundSlipResponse> getAllRefundSlips();
Page<RefundSlipResponse> getRefundSlips(
        String search,
        String status,
        Pageable pageable
);

    RefundSlipResponse getRefundSlipById(
            Integer refundSlipId);

    RefundSlipResponse approveRefund(
            Integer refundSlipId);

    RefundSlipResponse rejectRefund(
            Integer refundSlipId);

    RefundSlipResponse markRefunded(
            Integer refundSlipId);

    RefundSlipResponse transferRefund(Integer refundSlipId);
}