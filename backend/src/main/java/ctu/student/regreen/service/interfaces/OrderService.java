package ctu.student.regreen.service.interfaces;

import java.util.List;

import ctu.student.regreen.dto.request.OrderRequest;
import ctu.student.regreen.dto.response.OrderResponse;

public interface OrderService {

        OrderResponse checkout(
                        OrderRequest request);

        OrderResponse getById(
                        Integer id);

        List<OrderResponse> getMyOrders();

        OrderResponse cancel(
                        Integer id);

        OrderResponse pay(Integer id);
}