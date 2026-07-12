package ctu.student.regreen.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import ctu.student.regreen.dto.response.OrderItemResponse;
import ctu.student.regreen.dto.response.OrderResponse;
import ctu.student.regreen.dto.response.OrderSummaryResponse;
import ctu.student.regreen.model.Order;
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

        Float total = order.getOrderItems()
                .stream()
                .map(i -> i.getPurchasedPrice() * i.getQuantity())
                .reduce(0f, Float::sum);

        if (order.getVoucher() != null) {
            total -= order.getVoucher().getDiscountValue();
            if (total < 0)
                total = 0f;
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

        Float total = order.getOrderItems()
                .stream()
                .map(i -> i.getPurchasedPrice() * i.getQuantity())
                .reduce(0f, Float::sum);

        if (order.getVoucher() != null) {

            total -= order.getVoucher().getDiscountValue();

            if (total < 0) {
                total = 0f;
            }
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