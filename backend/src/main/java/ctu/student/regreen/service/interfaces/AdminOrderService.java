package ctu.student.regreen.service.interfaces;

import java.util.List;

import ctu.student.regreen.dto.response.OrderResponse;

public interface AdminOrderService {

    List<OrderResponse> getAllOrders();

    OrderResponse getOrderById(
            Integer orderId);

    OrderResponse confirmOrder(
            Integer orderId);

    OrderResponse shippingOrder(
            Integer orderId);

    OrderResponse completeOrder(
            Integer orderId);

    OrderResponse rejectOrder(
            Integer orderId);
}