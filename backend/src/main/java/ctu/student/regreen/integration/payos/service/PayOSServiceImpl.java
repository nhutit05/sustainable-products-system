package ctu.student.regreen.integration.payos.service;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

import org.springframework.stereotype.Service;

import ctu.student.regreen.integration.payos.config.PayOSProperties;
import ctu.student.regreen.integration.payos.dto.PayOSCheckoutResult;
import ctu.student.regreen.integration.payos.exception.PayOSException;
import ctu.student.regreen.integration.payos.util.PayOSOrderCodeGenerator;
import ctu.student.regreen.model.Order;
import lombok.RequiredArgsConstructor;
import vn.payos.PayOS;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkRequest;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkResponse;
import vn.payos.model.v2.paymentRequests.PaymentLinkItem;

@Service
@RequiredArgsConstructor
public class PayOSServiceImpl implements PayOSService {

        private final PayOS payOS;
        private final PayOSProperties properties;
        private final PayOSOrderCodeGenerator orderCodeGenerator;

        @Override
        public PayOSCheckoutResult createCheckout(
                        Order order,
                        long payableAmount) {
                

                try {

                        long orderCode = orderCodeGenerator.generate();

                        CreatePaymentLinkRequest request = buildRequest(order, orderCode, payableAmount);

                        CreatePaymentLinkResponse response = payOS.paymentRequests()
                                        .create(request);

                        return map(orderCode, response);

                } catch (Exception ex) {

                        ex.printStackTrace();

                        throw new PayOSException(ex.getMessage(), ex);

                }

        }

        @Override
        public void refund(Order order) {

                throw new UnsupportedOperationException(
                                "Not implemented yet");
        }

        // private long generateOrderCode() {
        // return System.currentTimeMillis();
        // }

        private CreatePaymentLinkRequest buildRequest(
                        Order order,
                        long orderCode,
                        long payableAmount) {

                long expiredAt = Instant.now()
                                .plus(Duration.ofMinutes(15))
                                .getEpochSecond();

                return CreatePaymentLinkRequest.builder()
                                .orderCode(orderCode)
                                .amount(payableAmount)
                                .description("DH-" + order.getOrderId())
                                .returnUrl(properties.getReturnUrl())
                                .cancelUrl(properties.getCancelUrl())
                                .items(buildItems(order))
                                .expiredAt(expiredAt)
                                .build();
        }

        private PayOSCheckoutResult map(
                        Long orderCode,
                        CreatePaymentLinkResponse response) {

                LocalDateTime expiredAt = null;

                if (response.getExpiredAt() != null) {
                        expiredAt = LocalDateTime.ofInstant(
                                        Instant.ofEpochSecond(response.getExpiredAt()),
                                        ZoneId.systemDefault());
                }

                return PayOSCheckoutResult.builder()
                                .payOSOrderCode(orderCode)
                                .checkoutUrl(response.getCheckoutUrl())
                                .qrCode(response.getQrCode())
                                .expiredAt(expiredAt)
                                .build();
        }

        private List<PaymentLinkItem> buildItems(Order order) {

                return order.getOrderItems()
                                .stream()
                                .map(item -> PaymentLinkItem.builder()
                                                .name(item.getProduct().getProductName())
                                                .quantity(item.getQuantity())
                                                .price((long) Math.round(item.getPurchasedPrice()))
                                                .build())
                                .toList();
        }
}