package ctu.student.regreen.mapper;

import org.springframework.stereotype.Component;

import ctu.student.regreen.dto.response.OrderItemResponse;
import ctu.student.regreen.model.OrderItem;

@Component
public class OrderItemMapper {

    public OrderItemResponse toResponse(OrderItem item) {

        Float subTotal =
                item.getPurchasedPrice() * item.getQuantity();

        return new OrderItemResponse(
                item.getProduct().getProductId(),
                item.getProduct().getProductName(),
                item.getQuantity(),
                item.getPurchasedPrice(),
                subTotal
        );
    }
}