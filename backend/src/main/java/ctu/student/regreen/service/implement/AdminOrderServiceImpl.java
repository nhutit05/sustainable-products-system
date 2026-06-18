package ctu.student.regreen.service.implement;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ctu.student.regreen.dto.response.OrderResponse;
import ctu.student.regreen.enums.OrderStatusName;
import ctu.student.regreen.mapper.OrderMapper;
import ctu.student.regreen.model.Order;
import ctu.student.regreen.model.OrderStatus;
import ctu.student.regreen.repository.OrderRepository;
import ctu.student.regreen.repository.OrderStatusRepository;
import ctu.student.regreen.service.interfaces.AdminOrderService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminOrderServiceImpl
        implements AdminOrderService {

    private final OrderRepository orderRepository;

    private final OrderStatusRepository orderStatusRepository;

    private final OrderMapper orderMapper;

    @Override
    public List<OrderResponse> getAllOrders() {

        return orderRepository.findAll()
                .stream()
                .map(orderMapper::toResponse)
                .toList();
    }

    @Override
    public OrderResponse getOrderById(
            Integer orderId) {

        Order order =
                orderRepository.findById(orderId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found"));

        return orderMapper.toResponse(order);
    }

    @Override
    public OrderResponse confirmOrder(
            Integer orderId) {

        return updateStatus(
                orderId,
                OrderStatusName.CONFIRMED);
    }

    @Override
    public OrderResponse shippingOrder(
            Integer orderId) {

        return updateStatus(
                orderId,
                OrderStatusName.SHIPPING);
    }

    @Override
    public OrderResponse completeOrder(
            Integer orderId) {

        return updateStatus(
                orderId,
                OrderStatusName.COMPLETED);
    }

    @Override
    public OrderResponse rejectOrder(
            Integer orderId) {

        return updateStatus(
                orderId,
                OrderStatusName.CANCELLED);
    }

    private OrderResponse updateStatus(
            Integer orderId,
            OrderStatusName statusName) {

        Order order =
                orderRepository.findById(orderId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found"));

        order.setOrderStatus(
                getOrderStatus(statusName));

        return orderMapper.toResponse(
                orderRepository.save(order));
    }

    private OrderStatus getOrderStatus(
            OrderStatusName statusName) {

        return orderStatusRepository
                .findByOrderStatusName(
                        statusName.name())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order status not found: "
                                        + statusName));
    }
}