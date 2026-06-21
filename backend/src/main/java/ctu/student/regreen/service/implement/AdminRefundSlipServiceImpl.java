package ctu.student.regreen.service.implement;

import ctu.student.regreen.dto.response.RefundSlipResponse;
import ctu.student.regreen.enums.RefundStatusName;
import ctu.student.regreen.mapper.RefundSlipMapper;
import ctu.student.regreen.model.RefundSlip;
import ctu.student.regreen.model.RefundStatus;
import ctu.student.regreen.repository.RefundSlipRepository;
import ctu.student.regreen.repository.RefundStatusRepository;
import ctu.student.regreen.service.interfaces.AdminRefundSlipService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminRefundSlipServiceImpl
                implements AdminRefundSlipService {

        private final RefundSlipRepository refundSlipRepository;

        private final RefundStatusRepository refundStatusRepository;

        private final RefundSlipMapper refundSlipMapper;

        @Override
        public List<RefundSlipResponse> getAllRefundSlips() {

                return refundSlipRepository.findAll()
                                .stream()
                                .map(refundSlipMapper::toResponse)
                                .toList();
        }

        @Override
        public RefundSlipResponse getRefundSlipById(
                        Integer refundSlipId) {

                RefundSlip refundSlip = refundSlipRepository.findById(
                                refundSlipId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Refund slip not found"));

                return refundSlipMapper.toResponse(
                                refundSlip);
        }

        @Override
        public RefundSlipResponse approveRefund(
                        Integer refundSlipId) {

                return updateStatus(
                                refundSlipId,
                                RefundStatusName.APPROVED);
        }

        @Override
        public RefundSlipResponse rejectRefund(
                        Integer refundSlipId) {

                return updateStatus(
                                refundSlipId,
                                RefundStatusName.REJECTED);
        }

        @Override
        public RefundSlipResponse markRefunded(
                        Integer refundSlipId) {

                return updateStatus(
                                refundSlipId,
                                RefundStatusName.REFUNDED);
        }

        private RefundSlipResponse updateStatus(
                        Integer refundSlipId,
                        RefundStatusName statusName) {

                RefundSlip refundSlip = refundSlipRepository.findById(
                                refundSlipId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Refund slip not found"));

                RefundStatusName currentStatus = RefundStatusName.valueOf(
                                refundSlip.getRefundStatus()
                                                .getRefundStatusName());

                validateTransition(
                                currentStatus,
                                statusName);

                RefundStatus refundStatus = refundStatusRepository
                                .findByRefundStatusName(
                                                statusName.name())
                                .orElseThrow(() -> new RuntimeException(
                                                "Refund status not found"));

                refundSlip.setRefundStatus(
                                refundStatus);

                return refundSlipMapper.toResponse(
                                refundSlipRepository.save(
                                                refundSlip));
        }

        private void validateTransition(
                        RefundStatusName current,
                        RefundStatusName next) {

                if (current == RefundStatusName.PENDING
                                && (next == RefundStatusName.APPROVED
                                                || next == RefundStatusName.REJECTED)) {
                        return;
                }

                if (current == RefundStatusName.APPROVED
                                && next == RefundStatusName.REFUNDED) {
                        return;
                }

                throw new RuntimeException(
                                "Invalid refund status transition");
        }
}