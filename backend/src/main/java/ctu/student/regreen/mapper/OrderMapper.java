package ctu.student.regreen.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import ctu.student.regreen.dto.response.OrderItemResponse;
import ctu.student.regreen.dto.response.OrderResponse;
import ctu.student.regreen.dto.response.OrderSummaryResponse;
import ctu.student.regreen.model.Order;
import ctu.student.regreen.model.OrderItem;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OrderMapper {

    private final OrderItemMapper itemMapper;

    public OrderResponse toResponse(Order order) {

        List<OrderItemResponse> items = order.getOrderItems()
                .stream()
                .map(itemMapper::toResponse)
                .toList();

        float total = 0;

        for (OrderItem item : order.getOrderItems()) {

            long price = Math.round(item.getPurchasedPrice());

            total += price * item.getQuantity();
        }

        if (order.getVoucher() != null) {
            total = total - Math.round(total * order.getVoucher().getDiscountValue() / 100.0);
        }

        return new OrderResponse(
                order.getOrderId(),
                order.getOrderedAt(),

                order.getOrderReceiver(),
                order.getOrderReceiverPhone(),

                order.getOrderAddress(),

                order.getCustomer().getUserId(),
                order.getCustomer().getUsername(),

                order.getPaymentMethod().getPaymentMethodId(),
                order.getPaymentMethod().getPaymentMethodName(),

                order.getVoucher() != null ? order.getVoucher().getVoucherId() : null,
                order.getVoucher() != null ? order.getVoucher().getCode() : null,

                order.getOrderStatus().getOrderStatusId(),
                order.getOrderStatus().getOrderStatusName(),

                order.getPaymentStatus().getPaymentStatusId(),
                order.getPaymentStatus().getPaymentStatusName(),

                total,
                items);
    }

    public OrderSummaryResponse toSummary(Order order) {

        float total = 0;

        for (OrderItem item : order.getOrderItems()) {

            long price = Math.round(item.getPurchasedPrice());

            total += price * item.getQuantity();
        }

        if (order.getVoucher() != null) {
            total = total - Math.round(total * order.getVoucher().getDiscountValue() / 100.0);
        }

        return new OrderSummaryResponse(

                order.getOrderId(),

                order.getOrderedAt(),

                order.getCustomer().getUserId(),
                order.getCustomer().getUsername(),

                order.getPaymentMethod().getPaymentMethodId(),
                order.getPaymentMethod().getPaymentMethodName(),

                order.getPaymentStatus().getPaymentStatusId(),
                order.getPaymentStatus().getPaymentStatusName(),

                order.getOrderStatus().getOrderStatusId(),
                order.getOrderStatus().getOrderStatusName(),

                total);
    }
}