package ctu.student.regreen.integration.payos.scheduler;

import java.time.Clock;
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
import ctu.student.regreen.model.PaymentMethod;
import ctu.student.regreen.model.PaymentStatus;
import ctu.student.regreen.model.Product;
import ctu.student.regreen.repository.OrderRepository;
import ctu.student.regreen.repository.OrderStatusRepository;
import ctu.student.regreen.repository.PaymentStatusRepository;
import ctu.student.regreen.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentTimeoutScheduler {

    private final OrderRepository orderRepository;
    private final PaymentStatusRepository paymentStatusRepository;
    private final OrderStatusRepository orderStatusRepository;
    private final ProductRepository productRepository;

    @Scheduled(fixedDelay = 60000)
    @Transactional
    public void cancelExpiredOrders() {

        LocalDateTime expiredTime = LocalDateTime.now(Clock.systemUTC()).minusMinutes(15);
        // System.out.println("UTC now = " + LocalDateTime.now(Clock.systemUTC()));
        System.out.println("Expired = " + expiredTime);
        // log.info("Expired:", expiredTime);

        List<Order> orders = orderRepository.findExpiredOrdersWithItems(
                        true,
                        PaymentStatusName.UNPAID.name(),
                        expiredTime);

        System.out.println("Expired orders: " + orders.size());
        // log.info("Expired orders:", orders.size());
        

        PaymentStatus failed = paymentStatusRepository
                .findByPaymentStatusName(PaymentStatusName.FAILED.name())
                .orElseThrow();

        OrderStatus cancelled = orderStatusRepository
                .findByOrderStatusName(OrderStatusName.CANCELLED.name())
                .orElseThrow();

        for (Order order : orders) {

            System.out.println("Cancelling order " + order.getOrderId());
            // log.info("Cancelling order:", order.getOrderId());

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

        System.out.println("Scheduler done");
        // log.info("Schedule done");
    }
}
