// package ctu.student.regreen.service;

// import static org.junit.jupiter.api.Assertions.assertEquals;
// import static org.junit.jupiter.api.Assertions.assertNotNull;
// import static org.junit.jupiter.api.Assertions.assertThrows;
// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.Mockito.lenient;
// import static org.mockito.Mockito.mock;
// import static org.mockito.Mockito.never;
// import static org.mockito.Mockito.verify;
// import static org.mockito.Mockito.when;

// import java.util.List;
// import java.util.Optional;

// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.junit.jupiter.MockitoExtension;

// import ctu.student.regreen.dto.response.OrderResponse;
// import ctu.student.regreen.mapper.OrderMapper;
// import ctu.student.regreen.model.Order;
// import ctu.student.regreen.model.OrderStatus;
// import ctu.student.regreen.model.PaymentMethod;
// import ctu.student.regreen.model.PaymentStatus;
// import ctu.student.regreen.repository.OrderRepository;
// import ctu.student.regreen.repository.OrderStatusRepository;
// import ctu.student.regreen.repository.PaymentStatusRepository;
// import ctu.student.regreen.service.implement.AdminOrderServiceImpl;

// @ExtendWith(MockitoExtension.class)
// public class AdminOrderServiceImplTest {
//         @Mock
//         private OrderRepository orderRepository;

//         @Mock
//         private OrderStatusRepository orderStatusRepository;

//         @Mock
//         private PaymentStatusRepository paymentStatusRepository;

//         @Mock
//         private OrderMapper orderMapper;

//         @InjectMocks
//         private AdminOrderServiceImpl service;

//         private Order order;
//         private OrderResponse response;

//         // @BeforeEach
//         // void setUp() {

//         // order = new Order();

//         // response = mock(OrderResponse.class);

//         // when(orderMapper.toResponse(any(Order.class)))
//         // .thenReturn(response);
//         // }

//         @BeforeEach
//         void setUp() {
//                 order = new Order();

//                 response = mock(OrderResponse.class);

//                 lenient().when(orderMapper.toResponse(any(Order.class)))
//                                 .thenReturn(response);
//         }

//         private OrderStatus status(String name) {

//                 OrderStatus s = new OrderStatus();
//                 s.setOrderStatusName(name);

//                 return s;
//         }

//         private PaymentStatus paymentStatus(String name) {

//                 PaymentStatus s = new PaymentStatus();
//                 s.setPaymentStatusName(name);

//                 return s;
//         }

//         private PaymentMethod paymentMethod(boolean online) {

//                 PaymentMethod pm = new PaymentMethod();
//                 pm.setOnline(online);

//                 return pm;
//         }

//         @Test
//         void getAllOrders_success() {

//                 when(orderRepository.findAll())
//                                 .thenReturn(List.of(order));

//                 List<OrderResponse> result = service.getAllOrders();

//                 assertEquals(1, result.size());

//                 verify(orderRepository).findAll();
//         }

//         @Test
//         void getOrderById_success() {

//                 when(orderRepository.findById(1))
//                                 .thenReturn(Optional.of(order));

//                 OrderResponse result = service.getOrderById(1);

//                 assertNotNull(result);
//         }

//         @Test
//         void confirmOrder_success() {

//                 order.setOrderStatus(
//                                 status("PENDING"));

//                 when(orderRepository.findById(1))
//                                 .thenReturn(Optional.of(order));

//                 when(orderStatusRepository
//                                 .findByOrderStatusName("CONFIRMED"))
//                                 .thenReturn(Optional.of(
//                                                 status("CONFIRMED")));

//                 when(orderRepository.save(any()))
//                                 .thenReturn(order);

//                 service.confirmOrder(1);

//                 assertEquals(
//                                 "CONFIRMED",
//                                 order.getOrderStatus()
//                                                 .getOrderStatusName());
//         }

//         @Test
//         void shippingOrder_onlinePaid_success() {

//                 order.setOrderStatus(
//                                 status("CONFIRMED"));

//                 order.setPaymentMethod(
//                                 paymentMethod(true));

//                 order.setPaymentStatus(
//                                 paymentStatus("PAID"));

//                 when(orderRepository.findById(1))
//                                 .thenReturn(Optional.of(order));

//                 when(orderStatusRepository
//                                 .findByOrderStatusName("SHIPPING"))
//                                 .thenReturn(Optional.of(
//                                                 status("SHIPPING")));

//                 when(orderRepository.save(any()))
//                                 .thenReturn(order);

//                 service.shippingOrder(1);

//                 assertEquals(
//                                 "SHIPPING",
//                                 order.getOrderStatus()
//                                                 .getOrderStatusName());
//         }

//         @Test
//         void shippingOrder_onlineUnpaid_fail() {

//                 order.setOrderStatus(
//                                 status("CONFIRMED"));

//                 order.setPaymentMethod(
//                                 paymentMethod(true));

//                 order.setPaymentStatus(
//                                 paymentStatus("UNPAID"));

//                 when(orderRepository.findById(1))
//                                 .thenReturn(Optional.of(order));

//                 RuntimeException ex = assertThrows(
//                                 RuntimeException.class,
//                                 () -> service.shippingOrder(1));

//                 assertEquals(
//                                 "Online payment order must be paid before shipping",
//                                 ex.getMessage());

//                 verify(orderRepository, never())
//                                 .save(any());
//         }

//         @Test
//         void completeOrder_cod_autoPaid() {

//                 order.setOrderStatus(
//                                 status("SHIPPING"));

//                 order.setPaymentMethod(
//                                 paymentMethod(false));

//                 when(orderRepository.findById(1))
//                                 .thenReturn(Optional.of(order));

//                 when(paymentStatusRepository
//                                 .findByPaymentStatusName("PAID"))
//                                 .thenReturn(Optional.of(
//                                                 paymentStatus("PAID")));

//                 when(orderStatusRepository
//                                 .findByOrderStatusName("COMPLETED"))
//                                 .thenReturn(Optional.of(
//                                                 status("COMPLETED")));

//                 when(orderRepository.save(any()))
//                                 .thenReturn(order);

//                 service.completeOrder(1);

//                 assertEquals(
//                                 "PAID",
//                                 order.getPaymentStatus()
//                                                 .getPaymentStatusName());

//                 assertEquals(
//                                 "COMPLETED",
//                                 order.getOrderStatus()
//                                                 .getOrderStatusName());
//         }

//         @Test
//         void rejectOrder_success() {

//                 order.setOrderStatus(
//                                 status("PENDING"));

//                 when(orderRepository.findById(1))
//                                 .thenReturn(Optional.of(order));

//                 when(orderStatusRepository
//                                 .findByOrderStatusName("CANCELLED"))
//                                 .thenReturn(Optional.of(
//                                                 status("CANCELLED")));

//                 when(orderRepository.save(any()))
//                                 .thenReturn(order);

//                 service.rejectOrder(1);

//                 assertEquals(
//                                 "CANCELLED",
//                                 order.getOrderStatus()
//                                                 .getOrderStatusName());
//         }

//         @Test
//         void invalidTransition_fail() {

//                 order.setOrderStatus(
//                                 status("PENDING"));

//                 order.setPaymentMethod(
//                                 paymentMethod(false));

//                 when(orderRepository.findById(1))
//                                 .thenReturn(Optional.of(order));

//                 when(paymentStatusRepository
//                                 .findByPaymentStatusName("PAID"))
//                                 .thenReturn(Optional.of(
//                                                 paymentStatus("PAID")));

//                 RuntimeException ex = assertThrows(
//                                 RuntimeException.class,
//                                 () -> service.completeOrder(1));

//                 assertEquals(
//                                 "Invalid order status transition",
//                                 ex.getMessage());
//         }
// }
