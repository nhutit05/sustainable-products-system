package ctu.student.regreen.integration.payos.scheduler;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import ctu.student.regreen.enums.OrderStatusName;
import ctu.student.regreen.enums.PaymentStatusName;
import ctu.student.regreen.model.Order;
import ctu.student.regreen.model.OrderItem;
import ctu.student.regreen.model.OrderStatus;
import ctu.student.regreen.model.PaymentStatus;
import ctu.student.regreen.model.Product;
import ctu.student.regreen.repository.OrderRepository;
import ctu.student.regreen.repository.OrderStatusRepository;
import ctu.student.regreen.repository.PaymentStatusRepository;
import ctu.student.regreen.repository.ProductRepository;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class PaymentTimeoutScheduler {

    private final OrderRepository orderRepository;
    private final PaymentStatusRepository paymentStatusRepository;
    private final OrderStatusRepository orderStatusRepository;
    private final ProductRepository productRepository;

    @Scheduled(fixedDelay = 60000)
    @Transactional
    public void cancelExpiredOrders() {

        LocalDateTime expiredTime = LocalDateTime.now().minusMinutes(15);

        List<Order> orders = orderRepository
                .findByPaymentStatusPaymentStatusNameAndOrderedAtBefore(
                        PaymentStatusName.UNPAID.name(),
                        expiredTime);

        System.out.println("Expired orders: " + orders.size());

        PaymentStatus failed = paymentStatusRepository
                .findByPaymentStatusName(PaymentStatusName.FAILED.name())
                .orElseThrow();

        OrderStatus cancelled = orderStatusRepository
                .findByOrderStatusName(OrderStatusName.CANCELLED.name())
                .orElseThrow();

        for (Order order : orders) {

            order.setPaymentStatus(failed);
            order.setOrderStatus(cancelled);

            for (OrderItem item : order.getOrderItems()) {

                Product product = item.getProduct();

                product.setInventory(
                        product.getInventory() + item.getQuantity());

                productRepository.save(product);
            }

            orderRepository.save(order);
        }
    }
}
