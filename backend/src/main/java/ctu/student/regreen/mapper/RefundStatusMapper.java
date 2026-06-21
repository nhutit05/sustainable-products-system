package ctu.student.regreen.mapper;

import ctu.student.regreen.dto.request.RefundStatusRequest;
import ctu.student.regreen.dto.response.RefundStatusResponse;
import ctu.student.regreen.model.RefundStatus;
import org.springframework.stereotype.Component;

@Component
public class RefundStatusMapper {

    public RefundStatus toEntity(
            RefundStatusRequest request) {

        RefundStatus status =
                new RefundStatus();

        status.setRefundStatusName(
                request.getRefundStatusName());

        return status;
    }

    public RefundStatusResponse toResponse(
            RefundStatus status) {

        return new RefundStatusResponse(
                status.getRefundStatusId(),
                status.getRefundStatusName());
    }

    public void update(
            RefundStatus status,
            RefundStatusRequest request) {

        status.setRefundStatusName(
                request.getRefundStatusName());
    }
}