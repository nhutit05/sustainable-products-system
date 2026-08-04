package ctu.student.regreen.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import ctu.student.regreen.dto.response.OrderResponse;
import ctu.student.regreen.dto.response.OrderSummaryResponse;
import ctu.student.regreen.mapper.OrderMapper;
import ctu.student.regreen.model.Order;
import ctu.student.regreen.model.OrderStatus;
import ctu.student.regreen.model.PaymentMethod;
import ctu.student.regreen.model.PaymentStatus;
import ctu.student.regreen.repository.OrderRepository;
import ctu.student.regreen.repository.OrderStatusRepository;
import ctu.student.regreen.repository.PaymentStatusRepository;
import ctu.student.regreen.service.implement.AdminOrderServiceImpl;
import ctu.student.regreen.service.interfaces.NotificationService;

@ExtendWith(MockitoExtension.class)
class AdminOrderServiceImplTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderStatusRepository orderStatusRepository;

    @Mock
    private PaymentStatusRepository paymentStatusRepository;

    @Mock
    private OrderMapper orderMapper;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private AdminOrderServiceImpl service;

    private Order order;
    private OrderResponse response;

    private static final Integer ORDER_ID = 1;
    private static final LocalDateTime ORDERED_AT =
            LocalDateTime.of(2025, 6, 1, 10, 0);

    @BeforeEach
    void setUp() {

        order = new Order();
        order.setOrderId(ORDER_ID);
        order.setOrderedAt(ORDERED_AT);
        order.setOrderReceiver("Nguyen Van A");
        order.setOrderReceiverPhone("0901234567");
        order.setOrderAddress("123 ABC");

        response = new OrderResponse();
        response.setOrderId(ORDER_ID);
        response.setOrderStatusName("CONFIRMED");
    }

    private OrderStatus status(String name) {

        OrderStatus s = new OrderStatus();
        s.setOrderStatusName(name);

        return s;
    }

    private PaymentStatus paymentStatus(String name) {

        PaymentStatus s = new PaymentStatus();
        s.setPaymentStatusName(name);

        return s;
    }

    private PaymentMethod paymentMethod(boolean online) {

        PaymentMethod pm = new PaymentMethod();
        pm.setOnline(online);

        return pm;
    }

    private void mockGetOrderEntity() {

        when(orderRepository.findByIdWithDetails(ORDER_ID))
                .thenReturn(Optional.of(order));
    }

    private void mockUpdateStatus(
            String currentStatusName,
            String newStatusName) {

        order.setOrderStatus(status(currentStatusName));

        mockGetOrderEntity();

        when(orderStatusRepository
                .findByOrderStatusName(newStatusName))
                .thenReturn(Optional.of(status(newStatusName)));

        when(orderRepository.save(any(Order.class)))
                .thenReturn(order);

        when(orderMapper.toResponse(any(Order.class)))
                .thenReturn(response);
    }

    // ==================== getOrders ====================

    @Test
    void getOrders_success() {

        OrderSummaryResponse summary =
                new OrderSummaryResponse();
        summary.setOrderId(ORDER_ID);

        Pageable pageable = PageRequest.of(0, 10);
        Page<Order> orderPage =
                new PageImpl<>(List.of(order), pageable, 1);

        when(orderRepository.findAll(
                any(Specification.class),
                any(Pageable.class)))
                .thenReturn(orderPage);

        when(orderMapper.toSummary(order))
                .thenReturn(summary);

        Page<OrderSummaryResponse> result =
                service.getOrders(
                        null, null, null, null,
                        null, null, pageable);

        assertEquals(1, result.getContent().size());
        assertEquals(ORDER_ID,
                result.getContent().get(0).getOrderId());

        verify(orderRepository).findAll(
                any(Specification.class),
                any(Pageable.class));
        verify(orderMapper).toSummary(order);
    }

    @Test
    void getOrders_empty_returnsEmptyPage() {

        Pageable pageable = PageRequest.of(0, 10);
        Page<Order> emptyPage =
                new PageImpl<>(Collections.emptyList(), pageable, 0);

        when(orderRepository.findAll(
                any(Specification.class),
                any(Pageable.class)))
                .thenReturn(emptyPage);

        Page<OrderSummaryResponse> result =
                service.getOrders(
                        null, null, null, null,
                        null, null, pageable);

        assertTrue(result.getContent().isEmpty());
        verify(orderMapper, never()).toSummary(any());
    }

    // ==================== getOrderById ====================

    @Test
    void getOrderById_success() {

        mockGetOrderEntity();
        when(orderMapper.toResponse(order))
                .thenReturn(response);

        OrderResponse result =
                service.getOrderById(ORDER_ID);

        assertNotNull(result);
        assertEquals(ORDER_ID, result.getOrderId());
        verify(orderRepository).findByIdWithDetails(ORDER_ID);
        verify(orderMapper).toResponse(order);
    }

    @Test
    void getOrderById_notFound_throwsException() {

        when(orderRepository.findByIdWithDetails(ORDER_ID))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.getOrderById(ORDER_ID));

        assertEquals("Order not found", ex.getMessage());
    }

    // ==================== confirmOrder ====================

    @Test
    void confirmOrder_success() {

        mockUpdateStatus("PENDING", "CONFIRMED");

        OrderResponse result =
                service.confirmOrder(ORDER_ID);

        assertNotNull(result);
        assertEquals("CONFIRMED",
                order.getOrderStatus().getOrderStatusName());

        verify(orderRepository).save(order);
        verify(orderMapper).toResponse(order);
        verify(notificationService)
                .notifyOrderStatusChanged(
                        order, "PENDING", "CONFIRMED");
    }

    @Test
    void confirmOrder_notFound_throwsException() {

        when(orderRepository.findByIdWithDetails(ORDER_ID))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.confirmOrder(ORDER_ID));

        assertEquals("Order not found", ex.getMessage());
        verify(orderRepository, never()).save(any());
    }

    // ==================== shippingOrder ====================

    @Test
    void shippingOrder_onlinePaid_success() {

        order.setPaymentMethod(paymentMethod(true));
        order.setPaymentStatus(paymentStatus("PAID"));

        mockUpdateStatus("CONFIRMED", "SHIPPING");

        OrderResponse result =
                service.shippingOrder(ORDER_ID);

        assertNotNull(result);
        assertEquals("SHIPPING",
                order.getOrderStatus().getOrderStatusName());

        verify(orderRepository).save(order);
        verify(notificationService)
                .notifyOrderStatusChanged(
                        order, "CONFIRMED", "SHIPPING");
    }

    @Test
    void shippingOrder_cod_success() {

        order.setPaymentMethod(paymentMethod(false));

        mockUpdateStatus("CONFIRMED", "SHIPPING");

        OrderResponse result =
                service.shippingOrder(ORDER_ID);

        assertNotNull(result);
        assertEquals("SHIPPING",
                order.getOrderStatus().getOrderStatusName());

        verify(orderRepository).save(order);
    }

    @Test
    void shippingOrder_onlineUnpaid_throwsException() {

        order.setPaymentMethod(paymentMethod(true));
        order.setPaymentStatus(paymentStatus("UNPAID"));

        mockGetOrderEntity();

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.shippingOrder(ORDER_ID));

        assertEquals(
                "Online payment order must be paid before shipping",
                ex.getMessage());

        verify(orderRepository, never()).save(any());
    }

    @Test
    void shippingOrder_notFound_throwsException() {

        when(orderRepository.findByIdWithDetails(ORDER_ID))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.shippingOrder(ORDER_ID));

        assertEquals("Order not found", ex.getMessage());
    }

    // ==================== completeOrder ====================

    @Test
    void completeOrder_cod_autoPaid() {

        order.setPaymentMethod(paymentMethod(false));

        mockUpdateStatus("SHIPPING", "COMPLETED");

        when(paymentStatusRepository
                .findByPaymentStatusName("PAID"))
                .thenReturn(Optional.of(paymentStatus("PAID")));

        OrderResponse result =
                service.completeOrder(ORDER_ID);

        assertNotNull(result);
        assertEquals("COMPLETED",
                order.getOrderStatus().getOrderStatusName());
        assertEquals("PAID",
                order.getPaymentStatus().getPaymentStatusName());

        verify(orderRepository).save(order);
        verify(notificationService)
                .notifyOrderStatusChanged(
                        order, "SHIPPING", "COMPLETED");
    }

    @Test
    void completeOrder_onlineAlreadyPaid_success() {

        order.setPaymentMethod(paymentMethod(true));
        order.setPaymentStatus(paymentStatus("PAID"));

        mockUpdateStatus("SHIPPING", "COMPLETED");

        OrderResponse result =
                service.completeOrder(ORDER_ID);

        assertNotNull(result);
        assertEquals("COMPLETED",
                order.getOrderStatus().getOrderStatusName());

        verify(orderRepository).save(order);
        verify(paymentStatusRepository, never())
                .findByPaymentStatusName(any());
    }

    @Test
    void completeOrder_notFound_throwsException() {

        when(orderRepository.findByIdWithDetails(ORDER_ID))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.completeOrder(ORDER_ID));

        assertEquals("Order not found", ex.getMessage());
        verify(orderRepository, never()).save(any());
    }

    // ==================== rejectOrder ====================

    @Test
    void rejectOrder_success() {

        mockUpdateStatus("PENDING", "CANCELLED");

        OrderResponse result =
                service.rejectOrder(ORDER_ID);

        assertNotNull(result);
        assertEquals("CANCELLED",
                order.getOrderStatus().getOrderStatusName());

        verify(orderRepository).save(order);
        verify(notificationService)
                .notifyOrderStatusChanged(
                        order, "PENDING", "CANCELLED");
    }

    @Test
    void rejectOrder_fromConfirmed_success() {

        mockUpdateStatus("CONFIRMED", "CANCELLED");

        OrderResponse result =
                service.rejectOrder(ORDER_ID);

        assertNotNull(result);
        assertEquals("CANCELLED",
                order.getOrderStatus().getOrderStatusName());

        verify(orderRepository).save(order);
        verify(notificationService)
                .notifyOrderStatusChanged(
                        order, "CONFIRMED", "CANCELLED");
    }

    @Test
    void rejectOrder_notFound_throwsException() {

        when(orderRepository.findByIdWithDetails(ORDER_ID))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.rejectOrder(ORDER_ID));

        assertEquals("Order not found", ex.getMessage());
    }

    // ==================== invalid transitions ====================

    @Test
    void shippingOrder_fromPending_throwsException() {

        order.setOrderStatus(status("PENDING"));
        order.setPaymentMethod(paymentMethod(false));

        mockGetOrderEntity();

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.shippingOrder(ORDER_ID));

        assertEquals(
                "Invalid order status transition",
                ex.getMessage());

        verify(orderRepository, never()).save(any());
    }

    @Test
    void completeOrder_fromPending_throwsException() {

        order.setOrderStatus(status("PENDING"));
        order.setPaymentMethod(paymentMethod(false));

        mockGetOrderEntity();

        when(paymentStatusRepository
                .findByPaymentStatusName("PAID"))
                .thenReturn(Optional.of(paymentStatus("PAID")));

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.completeOrder(ORDER_ID));

        assertEquals(
                "Invalid order status transition",
                ex.getMessage());

        verify(orderRepository, never()).save(any());
    }

    @Test
    void confirmOrder_fromShipping_throwsException() {

        order.setOrderStatus(status("SHIPPING"));

        mockGetOrderEntity();

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.confirmOrder(ORDER_ID));

        assertEquals(
                "Invalid order status transition",
                ex.getMessage());

        verify(orderRepository, never()).save(any());
    }

    @Test
    void rejectOrder_fromShipping_throwsException() {

        order.setOrderStatus(status("SHIPPING"));

        mockGetOrderEntity();

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.rejectOrder(ORDER_ID));

        assertEquals(
                "Invalid order status transition",
                ex.getMessage());

        verify(orderRepository, never()).save(any());
    }

    @Test
    void confirmOrder_fromCompleted_throwsException() {

        order.setOrderStatus(status("COMPLETED"));

        mockGetOrderEntity();

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.confirmOrder(ORDER_ID));

        assertEquals(
                "Order status cannot be changed",
                ex.getMessage());

        verify(orderRepository, never()).save(any());
    }

    @Test
    void confirmOrder_fromCancelled_throwsException() {

        order.setOrderStatus(status("CANCELLED"));

        mockGetOrderEntity();

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.confirmOrder(ORDER_ID));

        assertEquals(
                "Order status cannot be changed",
                ex.getMessage());

        verify(orderRepository, never()).save(any());
    }
}
