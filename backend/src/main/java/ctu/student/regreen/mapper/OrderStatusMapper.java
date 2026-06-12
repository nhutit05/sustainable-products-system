package ctu.student.regreen.mapper;

import org.springframework.stereotype.Component;

import ctu.student.regreen.dto.request.OrderStatusRequest;
import ctu.student.regreen.dto.response.OrderStatusResponse;
import ctu.student.regreen.model.OrderStatus;

@Component
public class OrderStatusMapper {

    public OrderStatus toEntity(OrderStatusRequest request) {

        OrderStatus orderStatus = new OrderStatus();

        orderStatus.setOrderStatusName(request.getOrderStatusName());

        return orderStatus;
    }

    public OrderStatusResponse toResponse(OrderStatus orderStatus) {

        return new OrderStatusResponse(
                orderStatus.getOrderStatusId(),
                orderStatus.getOrderStatusName());
    }

    public void update(OrderStatus orderStatus, OrderStatusRequest request) {

        orderStatus.setOrderStatusName(request.getOrderStatusName());
    }
}