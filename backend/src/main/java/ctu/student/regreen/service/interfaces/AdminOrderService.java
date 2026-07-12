package ctu.student.regreen.service.interfaces;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestParam;

import ctu.student.regreen.dto.response.OrderResponse;
import ctu.student.regreen.dto.response.OrderSummaryResponse;

public interface AdminOrderService {

//     List<OrderSummaryResponse> getAllOrders();

//     Page<OrderSummaryResponse> getOrders(Pageable pageable);

Page<OrderSummaryResponse> getOrders(
        String keyword,
        Integer orderStatusId,
        Integer paymentStatusId,
        Integer paymentMethodId,
LocalDate startDate,
LocalDate endDate,
        Pageable pageable);

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