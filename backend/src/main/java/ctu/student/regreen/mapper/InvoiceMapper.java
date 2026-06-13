package ctu.student.regreen.mapper;

import org.springframework.stereotype.Component;

import ctu.student.regreen.dto.response.InvoiceResponse;
import ctu.student.regreen.model.Invoice;
import ctu.student.regreen.model.OrderItem;

@Component
public class InvoiceMapper {

    public InvoiceResponse toResponse(Invoice invoice) {

        @SuppressWarnings("null")
        Float totalAmount = invoice.getOrder()
                .getOrderItems()
                .stream()
                .map(this::calculateSubtotal)
                .reduce(0f, Float::sum);

        return new InvoiceResponse(
                invoice.getInvoiceId(),
                invoice.getCreatedAt(),
                invoice.getOrder().getOrderId(),
                invoice.getOrder().getOrderReceiver(),
                invoice.getOrder().getOrderReceiverPhone(),
                totalAmount
        );
    }

    private Float calculateSubtotal(OrderItem item) {

        return item.getPurchasedPrice()
                * item.getQuantity();
    }
}