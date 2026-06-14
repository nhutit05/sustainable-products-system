package ctu.student.regreen.service.interfaces;

import java.util.List;

import ctu.student.regreen.dto.response.OrderItemResponse;

public interface OrderItemService {

    List<OrderItemResponse> getByOrder(
            Integer orderId);
}