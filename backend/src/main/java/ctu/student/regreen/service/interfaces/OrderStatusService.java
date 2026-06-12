package ctu.student.regreen.service.interfaces;

import java.util.List;

import ctu.student.regreen.dto.request.OrderStatusRequest;
import ctu.student.regreen.dto.response.OrderStatusResponse;

public interface OrderStatusService {

    OrderStatusResponse create(OrderStatusRequest request);

    List<OrderStatusResponse> getAll();

    OrderStatusResponse getById(Integer id);

    OrderStatusResponse update(Integer id, OrderStatusRequest request);

    void delete(Integer id);
}