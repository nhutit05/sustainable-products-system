package ctu.student.regreen.integration.payos.service;

import org.springframework.stereotype.Service;

import ctu.student.regreen.enums.PaymentStatusName;
import ctu.student.regreen.model.Order;
import ctu.student.regreen.model.PaymentStatus;
import ctu.student.regreen.repository.OrderRepository;
import ctu.student.regreen.repository.PaymentStatusRepository;
import lombok.RequiredArgsConstructor;
import vn.payos.PayOS;
import vn.payos.model.webhooks.WebhookData;

@Service
@RequiredArgsConstructor
public class PayOSWebhookServiceImpl
        implements PayOSWebhookService {

    private final PayOS payOS;

    private final OrderRepository orderRepository;

    private final PaymentStatusRepository paymentStatusRepository;

    @Override
    public void handle(Object webhook) {

        WebhookData data = payOS.webhooks().verify(webhook);

        System.out.println("orderCode = " + data.getOrderCode());
        System.out.println("code = " + data.getCode());
        System.out.println("description = " + data.getDescription());
        System.out.println("reference = " + data.getReference());
        System.out.println("amount = " + data.getAmount());

        if (!"00".equals(data.getCode())) {
            return;
        }

        // Order order = orderRepository
        // .findByPayOSOrderCode(data.getOrderCode())
        // .orElseThrow(() -> new PayOSException("Order not found."));

        Order order = orderRepository
                .findByPayOSOrderCode(data.getOrderCode())
                .orElse(null);

        if (order == null) {
            System.out.println("Ignore webhook. orderCode = " + data.getOrderCode());
            return;
        }
        if (order.getPaymentStatus().getPaymentStatusName().equals(PaymentStatusName.PAID.name())) {
            return;
        }

        System.out.println("Current payment status: "
                + order.getPaymentStatus().getPaymentStatusName());

        PaymentStatus paid = paymentStatusRepository
                .findByPaymentStatusName(PaymentStatusName.PAID.name())
                .orElseThrow();

        order.setPaymentStatus(paid);

        orderRepository.save(order);
        // bước sau sẽ xử lý data
    }

    @Override
    public void confirm(String webhookUrl) {

        payOS.webhooks().confirm(webhookUrl);
    }
}