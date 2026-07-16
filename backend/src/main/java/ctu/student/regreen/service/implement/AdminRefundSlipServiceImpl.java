package ctu.student.regreen.service.implement;

import ctu.student.regreen.dto.response.RefundSlipResponse;
import ctu.student.regreen.enums.RefundStatusName;
import ctu.student.regreen.integration.payos.service.PayOSPayoutService;
import ctu.student.regreen.mapper.RefundSlipMapper;
import ctu.student.regreen.model.RefundSlip;
import ctu.student.regreen.model.RefundStatus;
import ctu.student.regreen.repository.RefundSlipRepository;
import ctu.student.regreen.repository.RefundStatusRepository;
import ctu.student.regreen.service.interfaces.AdminRefundSlipService;
import ctu.student.regreen.specification.RefundSlipSpecification;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminRefundSlipServiceImpl
                implements AdminRefundSlipService {

        private final RefundSlipRepository refundSlipRepository;

        private final RefundStatusRepository refundStatusRepository;

        private final RefundSlipMapper refundSlipMapper;

        private final PayOSPayoutService payOSPayoutService;

        // @Override
        // public List<RefundSlipResponse> getAllRefundSlips() {

        // return refundSlipRepository.findAll()
        // .stream()
        // .map(refundSlipMapper::toResponse)
        // .toList();
        // }

        @Override
        public Page<RefundSlipResponse> getRefundSlips(
                        String search,
                        String status,
                        Pageable pageable) {

                Specification<RefundSlip> specification = Specification
                                .where(RefundSlipSpecification.withFetchJoins())
                                .and(RefundSlipSpecification.filter(search, status));

                return refundSlipRepository
                                .findAll(specification, pageable)
                                .map(refundSlipMapper::toResponse);
        }

        @Override
        public RefundSlipResponse getRefundSlipById(
                        Integer refundSlipId) {

                RefundSlip refundSlip = refundSlipRepository.findByIdWithDetails(
                                refundSlipId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Refund slip not found"));

                return refundSlipMapper.toResponse(
                                refundSlip);
        }

        @Override
        @Transactional
        public RefundSlipResponse approveRefund(
                        Integer refundSlipId) {

                RefundSlip refundSlip = getRefundSlipEntity(refundSlipId);

                return updateStatus(
                                refundSlip,
                                RefundStatusName.APPROVED);
        }

        @Override
        @Transactional
        public RefundSlipResponse rejectRefund(
                        Integer refundSlipId) {

                RefundSlip refundSlip = getRefundSlipEntity(refundSlipId);

                return updateStatus(
                                refundSlip,
                                RefundStatusName.REJECTED);
        }

        @Override
        @Transactional
        public RefundSlipResponse markRefunded(
                        Integer refundSlipId) {

                RefundSlip refundSlip = getRefundSlipEntity(refundSlipId);

                return updateStatus(
                                refundSlip,
                                RefundStatusName.REFUNDED);
        }

        @Override
        @Transactional
        public RefundSlipResponse transferRefund(Integer refundSlipId) {

                RefundSlip refundSlip = getRefundSlipEntity(refundSlipId);

                validateTransition(
                                RefundStatusName.valueOf(refundSlip.getRefundStatus().getRefundStatusName()),
                                RefundStatusName.REFUNDED);

                Long refundAmount = Math.round(
                                refundSlip.getOrder().getOrderItems().stream()
                                                .mapToDouble(item -> item.getPurchasedPrice() * item.getQuantity())
                                                .sum());

                payOSPayoutService.transfer(
                                refundSlip.getRefundSlipId(),
                                refundSlip.getBank().getBankId(),
                                refundSlip.getBankNumber(),
                                refundAmount,
                                "Refund order #" + refundSlip.getOrder().getOrderId());

                RefundStatus refundedStatus = refundStatusRepository
                                .findByRefundStatusName(RefundStatusName.REFUNDED.name())
                                .orElseThrow(() -> new RuntimeException("Refund status not found"));

                refundSlip.setRefundStatus(refundedStatus);

                return refundSlipMapper.toResponse(
                                refundSlipRepository.save(refundSlip));
        }

        private RefundSlip getRefundSlipEntity(Integer refundSlipId) {
                return refundSlipRepository.findByIdWithDetails(refundSlipId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Refund slip not found"));
        }

        private RefundSlipResponse updateStatus(
                        RefundSlip refundSlip,
                        RefundStatusName statusName) {

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