package ctu.student.regreen.mapper;

import org.springframework.stereotype.Component;

import ctu.student.regreen.dto.response.InvoiceResponse;
import ctu.student.regreen.model.Invoice;
import ctu.student.regreen.model.Order;
import ctu.student.regreen.model.OrderItem;

@Component
public class InvoiceMapper {

        

    public InvoiceResponse toResponse(Invoice invoice) {

        Order order = invoice.getOrder();

        Float totalAmount = order.getOrderItems() == null
                ? 0f
                : order.getOrderItems()
                        .stream()
                        .map(this::calculateSubtotal)
                        .reduce(0f, Float::sum);

        Float discountAmount = 0f;

        if (order.getVoucher() != null
                && order.getVoucher().getDiscountValue() != null) {

            discountAmount = order.getVoucher().getDiscountValue();
        }

        Float finalAmount = Math.max(totalAmount - discountAmount, 0f);

        return new InvoiceResponse(
                invoice.getInvoiceId(),
                invoice.getCreatedAt(),
                order.getOrderId(),
                order.getOrderReceiver(),
                order.getOrderReceiverPhone(),
                totalAmount,
                discountAmount,
                finalAmount
        );
    }

    private Float calculateSubtotal(OrderItem item) {

        if (item.getPurchasedPrice() == null || item.getQuantity() == null) {
            return 0f;
        }

        return item.getPurchasedPrice() * item.getQuantity();
    }

    public Invoice toEntity(Order order) {

        Invoice invoice = new Invoice();
        invoice.setOrder(order);

        return invoice;
    }
}

