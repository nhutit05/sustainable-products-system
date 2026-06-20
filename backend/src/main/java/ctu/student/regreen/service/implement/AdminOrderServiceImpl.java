package ctu.student.regreen.service.implement;

import java.util.List;

import org.springframework.stereotype.Service;

import ctu.student.regreen.dto.response.OrderResponse;
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
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
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
    public List<OrderResponse> getAllOrders() {

        return orderRepository.findAll()
                .stream()
                .map(orderMapper::toResponse)
                .toList();
    }

    @Override
    public OrderResponse getOrderById(Integer orderId) {

        return getOrder(orderId);
    }

    @Override
    public OrderResponse confirmOrder(Integer orderId) {
        return updateStatus(orderId, OrderStatusName.CONFIRMED);
    }

    @Override
    public OrderResponse shippingOrder(Integer orderId) {

        Order order = getOrderEntity(orderId);

        validateCanShip(order);

        return updateStatus(
                orderId,
                OrderStatusName.SHIPPING);
    }

    @Override
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