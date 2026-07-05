package ctu.student.regreen.service.implement;

import ctu.student.regreen.dto.request.RefundSlipRequest;
import ctu.student.regreen.dto.response.RefundSlipResponse;
import ctu.student.regreen.enums.OrderStatusName;
import ctu.student.regreen.enums.RefundStatusName;
import ctu.student.regreen.mapper.RefundSlipMapper;
import ctu.student.regreen.model.Bank;
import ctu.student.regreen.model.Customer;
import ctu.student.regreen.model.Order;
import ctu.student.regreen.model.RefundSlip;
import ctu.student.regreen.model.RefundStatus;
import ctu.student.regreen.repository.BankRepository;
import ctu.student.regreen.repository.CustomerRepository;
import ctu.student.regreen.repository.OrderRepository;
import ctu.student.regreen.repository.RefundSlipRepository;
import ctu.student.regreen.repository.RefundStatusRepository;
import ctu.student.regreen.service.interfaces.RefundSlipService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RefundSlipServiceImpl
                implements RefundSlipService {

        private final RefundSlipRepository refundSlipRepository;

        private final OrderRepository orderRepository;

        private final BankRepository bankRepository;

        private final CustomerRepository customerRepository;

        private final RefundStatusRepository refundStatusRepository;

        private final RefundSlipMapper refundSlipMapper;


        @Override
        public RefundSlipResponse create(
                        RefundSlipRequest request) {

                Customer customer = getCurrentCustomer();

                if (refundSlipRepository.existsByOrderOrderId(
                                request.getOrderId())) {

                        throw new RuntimeException(
                                        "Order already has refund slip");
                }

                Order order = orderRepository.findById(
                                request.getOrderId())
                                .orElseThrow(() -> new RuntimeException(
                                                "Order not found"));

                validateOwnership(
                                order,
                                customer);

                if (!order.getOrderStatus()
                                .getOrderStatusName()
                                .equals(OrderStatusName.COMPLETED.name())) {

                        throw new RuntimeException(
                                        "Only completed orders can be refunded");
                }

                Bank bank = bankRepository.findById(
                                request.getBankId())
                                .orElseThrow(() -> new RuntimeException(
                                                "Bank not found"));

                RefundSlip refundSlip = new RefundSlip();

                RefundStatus pendingStatus = refundStatusRepository
                                .findByRefundStatusName(
                                                RefundStatusName.PENDING.name())
                                .orElseThrow(() -> new RuntimeException(
                                                "Refund status not found"));

                refundSlip.setRefundStatus(
                                pendingStatus);

                refundSlip.setBankNumber(
                                request.getBankNumber());

                refundSlip.setAccountBankName(
                                request.getAccountBankName());

                refundSlip.setReason(
                                request.getReason());

                refundSlip.setOrder(order);

                refundSlip.setBank(bank);

                return refundSlipMapper.toResponse(
                                refundSlipRepository.save(
                                                refundSlip));
        }

        @Override
        public RefundSlipResponse getById(
                        Integer refundSlipId) {

                Customer customer = getCurrentCustomer();

                RefundSlip refundSlip = refundSlipRepository.findById(
                                refundSlipId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Refund slip not found"));

                validateOwnership(
                                refundSlip.getOrder(),
                                customer);

                return refundSlipMapper.toResponse(
                                refundSlip);
        }

        @Override
        public RefundSlipResponse getByOrder(
                        Integer orderId) {

                Customer customer = getCurrentCustomer();

                RefundSlip refundSlip = refundSlipRepository.findByOrderOrderId(
                                orderId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Refund slip not found"));

                validateOwnership(
                                refundSlip.getOrder(),
                                customer);

                return refundSlipMapper.toResponse(
                                refundSlip);
        }

        @Override
        public List<RefundSlipResponse> getMyRefundSlips() {

                Customer customer = getCurrentCustomer();

                return refundSlipRepository
                                .findByOrderCustomerUserId(
                                                customer.getUserId())
                                .stream()
                                .map(refundSlipMapper::toResponse)
                                .toList();
        }

        private Customer getCurrentCustomer() {

                String username = SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                .getName();

                return customerRepository
                                .findByUsername(username)
                                .orElseThrow(() -> new RuntimeException(
                                                "Customer not found"));
        }

        private void validateOwnership(
                        Order order,
                        Customer customer) {

                if (!order.getCustomer()
                                .getUserId()
                                .equals(customer.getUserId())) {

                        throw new RuntimeException(
                                        "Access denied");
                }
        }
}