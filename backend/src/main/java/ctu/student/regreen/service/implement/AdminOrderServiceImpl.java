package ctu.student.regreen.service.implement;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ctu.student.regreen.dto.response.OrderResponse;
import ctu.student.regreen.dto.response.OrderSummaryResponse;
import ctu.student.regreen.enums.OrderStatusName;
import ctu.student.regreen.enums.PaymentStatusName;
import ctu.student.regreen.mapper.OrderMapper;
import ctu.student.regreen.model.Order;
import ctu.student.regreen.model.OrderStatus;
import ctu.student.regreen.model.PaymentStatus;
import ctu.student.regreen.repository.OrderRepository;
import ctu.student.regreen.repository.OrderStatusRepository;
import ctu.student.regreen.repository.PaymentStatusRepository;
import ctu.student.regreen.service.interfaces.AdminOrderService;
import ctu.student.regreen.specification.OrderSpecification;
// import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminOrderServiceImpl implements AdminOrderService {

    private final OrderRepository orderRepository;
    private final OrderStatusRepository orderStatusRepository;
    private final OrderMapper orderMapper;
    private final PaymentStatusRepository paymentStatusRepository;

    private PaymentStatus getPaymentStatus(
            PaymentStatusName statusName) {

        return paymentStatusRepository
                .findByPaymentStatusName(
                        statusName.name())
                .orElseThrow(() -> new RuntimeException(
                        "Payment status not found"));
    }

    @Override
    public Page<OrderSummaryResponse> getOrders(
            String keyword,
            Integer orderStatusId,
            Integer paymentStatusId,
            Integer paymentMethodId,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable) {

        Specification<Order> specification = OrderSpecification.filter(
                keyword,
                orderStatusId,
                paymentStatusId,
                paymentMethodId,
                startDate, endDate);
                

        Pageable sortedPageable = pageable.getSort().isSorted()
        ? pageable
        : PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "orderedAt"));

        return orderRepository
                .findAll(specification, sortedPageable)
                .map(orderMapper::toSummary);
    }

    @Override
    public OrderResponse getOrderById(Integer orderId) {

        return getOrder(orderId);
    }

    @Override
    @Transactional
    public OrderResponse confirmOrder(Integer orderId) {
        return updateStatus(orderId, OrderStatusName.CONFIRMED);
    }

    @Override
    @Transactional
    public OrderResponse shippingOrder(Integer orderId) {

        Order order = getOrderEntity(orderId);

        validateCanShip(order);

        return updateStatus(
                orderId,
                OrderStatusName.SHIPPING);
    }

    @Override
    @Transactional
    public OrderResponse completeOrder(
            Integer orderId) {

        Order order = getOrderEntity(orderId);

        if (!order.getPaymentMethod().getOnline()) {

            order.setPaymentStatus(
                    getPaymentStatus(
                            PaymentStatusName.PAID));
        }

        return updateStatus(
                orderId,
                OrderStatusName.COMPLETED);
    }

    @Override
    @Transactional
    public OrderResponse rejectOrder(Integer orderId) {
        return updateStatus(orderId, OrderStatusName.CANCELLED);
    }

    private OrderResponse updateStatus(
            Integer orderId,
            OrderStatusName newStatus) {

        Order order = getOrderEntity(orderId);

        OrderStatusName currentStatus = OrderStatusName.valueOf(
                order.getOrderStatus()
                        .getOrderStatusName());

        validateTransition(
                currentStatus,
                newStatus);

        order.setOrderStatus(
                getOrderStatus(newStatus));

        return orderMapper.toResponse(
                orderRepository.save(order));
    }

    private Order getOrderEntity(Integer orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    private OrderResponse getOrder(Integer orderId) {
        return orderMapper.toResponse(getOrderEntity(orderId));
    }

    private OrderStatus getOrderStatus(OrderStatusName statusName) {

        return orderStatusRepository.findByOrderStatusName(statusName.name())
                .orElseThrow(() -> new RuntimeException("Order status not found: " + statusName));
    }

    private void validateTransition(
            OrderStatusName current,
            OrderStatusName next) {

        switch (current) {

            case PENDING -> {

                if (next != OrderStatusName.CONFIRMED
                        && next != OrderStatusName.CANCELLED) {

                    throw new RuntimeException(
                            "Invalid order status transition");
                }
            }

            case CONFIRMED -> {

                if (next != OrderStatusName.SHIPPING
                        && next != OrderStatusName.CANCELLED) {

                    throw new RuntimeException(
                            "Invalid order status transition");
                }
            }

            case SHIPPING -> {

                if (next != OrderStatusName.COMPLETED) {

                    throw new RuntimeException(
                            "Invalid order status transition");
                }
            }

            case COMPLETED, CANCELLED ->

                throw new RuntimeException(
                        "Order status cannot be changed");
        }
    }

    private void validateCanShip(Order order) {

        if (order.getPaymentMethod().getOnline()) {

            PaymentStatusName paymentStatus = PaymentStatusName.valueOf(
                    order.getPaymentStatus()
                            .getPaymentStatusName());

            if (paymentStatus != PaymentStatusName.PAID) {

                throw new RuntimeException(
                        "Online payment order must be paid before shipping");
            }
        }
    }
}