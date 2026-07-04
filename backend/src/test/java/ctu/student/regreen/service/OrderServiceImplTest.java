package ctu.student.regreen.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import ctu.student.regreen.dto.request.OrderRequest;
import ctu.student.regreen.dto.response.CheckoutResponse;
import ctu.student.regreen.dto.response.OrderResponse;
import ctu.student.regreen.integration.payos.service.PayOSService;
import ctu.student.regreen.mapper.OrderMapper;
import ctu.student.regreen.model.Cart;
import ctu.student.regreen.model.CartItem;
import ctu.student.regreen.model.CartItemId;
import ctu.student.regreen.model.Customer;
import ctu.student.regreen.model.Invoice;
import ctu.student.regreen.model.Order;
import ctu.student.regreen.model.OrderItem;
import ctu.student.regreen.model.OrderStatus;
import ctu.student.regreen.model.PaymentMethod;
import ctu.student.regreen.model.PaymentStatus;
import ctu.student.regreen.model.Product;
import ctu.student.regreen.repository.CartItemRepository;
import ctu.student.regreen.repository.CartRepository;
import ctu.student.regreen.repository.CustomerRepository;
import ctu.student.regreen.repository.InvoiceRepository;
import ctu.student.regreen.repository.OrderRepository;
import ctu.student.regreen.repository.OrderStatusRepository;
import ctu.student.regreen.repository.PaymentMethodRepository;
import ctu.student.regreen.repository.PaymentStatusRepository;
import ctu.student.regreen.repository.ProductRepository;
import ctu.student.regreen.repository.VoucherRepository;
import ctu.student.regreen.service.implement.OrderServiceImpl;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {

        @Mock
        private OrderRepository orderRepository;

        @Mock
        private CustomerRepository customerRepository;

        @Mock
        private ProductRepository productRepository;

        @Mock
        private CartRepository cartRepository;

        @Mock
        private CartItemRepository cartItemRepository;

        @Mock
        private PaymentMethodRepository paymentMethodRepository;

        @Mock
        private VoucherRepository voucherRepository;

        @Mock
        private OrderStatusRepository orderStatusRepository;

        @Mock
        private PaymentStatusRepository paymentStatusRepository;

        @Mock
        private InvoiceRepository invoiceRepository;

        @Mock
        private OrderMapper orderMapper;

        @Mock
        private PayOSService payOSService;

        @InjectMocks
        private OrderServiceImpl service;

        private Customer customer;
        private Order order;
        private OrderResponse response;

        @BeforeEach
        void setUp() {

                Authentication authentication = mock(Authentication.class);

                SecurityContext securityContext = mock(SecurityContext.class);

                when(authentication.getName())
                                .thenReturn("testuser");

                when(securityContext.getAuthentication())
                                .thenReturn(authentication);

                SecurityContextHolder.setContext(
                                securityContext);

                customer = new Customer();
                customer.setUserId(1);

                when(customerRepository
                                .findByUsername("testuser"))
                                .thenReturn(Optional.of(customer));

                order = new Order();

                response = mock(OrderResponse.class);

                lenient()
                                .when(orderMapper.toResponse(any()))
                                .thenReturn(response);
        }

        private OrderStatus orderStatus(String name) {

                OrderStatus status = new OrderStatus();
                status.setOrderStatusName(name);

                return status;
        }

        private PaymentStatus paymentStatus(String name) {

                PaymentStatus status = new PaymentStatus();
                status.setPaymentStatusName(name);

                return status;
        }

        private PaymentMethod paymentMethod(boolean online) {

                PaymentMethod method = new PaymentMethod();
                method.setOnline(online);

                return method;
        }

        @Test
        void getMyOrders_success() {

                order.setCustomer(customer);

                when(orderRepository
                                .findByCustomerUserId(1))
                                .thenReturn(List.of(order));

                List<OrderResponse> result = service.getMyOrders();

                assertEquals(1, result.size());

                verify(orderRepository)
                                .findByCustomerUserId(1);
        }

        @Test
        void getById_success() {

                order.setCustomer(customer);

                when(orderRepository.findById(1))
                                .thenReturn(Optional.of(order));

                OrderResponse result = service.getById(1);

                assertNotNull(result);
        }

        @Test
        void getById_accessDenied_fail() {

                Customer anotherCustomer = new Customer();

                anotherCustomer.setUserId(999);

                order.setCustomer(anotherCustomer);

                when(orderRepository.findById(1))
                                .thenReturn(Optional.of(order));

                RuntimeException ex = assertThrows(
                                RuntimeException.class,
                                () -> service.getById(1));

                assertEquals(
                                "Access denied",
                                ex.getMessage());
        }

        @Test
        void cancel_pending_success() {

                Product product = new Product();
                product.setInventory(10);

                OrderItem item = new OrderItem();
                item.setProduct(product);
                item.setQuantity(2);

                order.setCustomer(customer);
                order.setOrderItems(List.of(item));
                order.setOrderStatus(
                                orderStatus("PENDING"));

                when(orderRepository.findById(1))
                                .thenReturn(Optional.of(order));

                when(orderStatusRepository
                                .findByOrderStatusName("CANCELLED"))
                                .thenReturn(Optional.of(
                                                orderStatus("CANCELLED")));

                when(orderRepository.save(any()))
                                .thenReturn(order);

                service.cancel(1);

                assertEquals(
                                12,
                                product.getInventory());

                assertEquals(
                                "CANCELLED",
                                order.getOrderStatus()
                                                .getOrderStatusName());
        }

        @Test
        void cancel_alreadyCancelled_fail() {

                order.setCustomer(customer);

                order.setOrderStatus(
                                orderStatus("CANCELLED"));

                when(orderRepository.findById(1))
                                .thenReturn(Optional.of(order));

                when(orderStatusRepository
                                .findByOrderStatusName("CANCELLED"))
                                .thenReturn(Optional.of(
                                                orderStatus("CANCELLED")));

                RuntimeException ex = assertThrows(
                                RuntimeException.class,
                                () -> service.cancel(1));

                assertEquals(
                                "Order already cancelled",
                                ex.getMessage());
        }

        @Test
        void cancel_notPending_fail() {

                order.setCustomer(customer);

                order.setOrderStatus(
                                orderStatus("SHIPPING"));

                when(orderRepository.findById(1))
                                .thenReturn(Optional.of(order));

                when(orderStatusRepository
                                .findByOrderStatusName("CANCELLED"))
                                .thenReturn(Optional.of(
                                                orderStatus("CANCELLED")));

                RuntimeException ex = assertThrows(
                                RuntimeException.class,
                                () -> service.cancel(1));

                assertEquals(
                                "Order cannot be cancelled",
                                ex.getMessage());
        }

        @Test
        void pay_online_success() {

                order.setCustomer(customer);

                order.setPaymentMethod(
                                paymentMethod(true));

                when(orderRepository.findById(1))
                                .thenReturn(Optional.of(order));

                when(paymentStatusRepository
                                .findByPaymentStatusName("PAID"))
                                .thenReturn(Optional.of(
                                                paymentStatus("PAID")));

                when(orderRepository.save(any()))
                                .thenReturn(order);

                service.pay(1);

                assertEquals(
                                "PAID",
                                order.getPaymentStatus()
                                                .getPaymentStatusName());
        }

        @Test
        void pay_cod_fail() {

                order.setCustomer(customer);

                order.setPaymentMethod(
                                paymentMethod(false));

                when(orderRepository.findById(1))
                                .thenReturn(Optional.of(order));

                RuntimeException ex = assertThrows(
                                RuntimeException.class,
                                () -> service.pay(1));

                assertEquals(
                                "COD order cannot be paid online",
                                ex.getMessage());
        }

        @Test
        void pay_accessDenied_fail() {

                Customer anotherCustomer = new Customer();

                anotherCustomer.setUserId(99);

                order.setCustomer(anotherCustomer);

                order.setPaymentMethod(
                                paymentMethod(true));

                when(orderRepository.findById(1))
                                .thenReturn(Optional.of(order));

                RuntimeException ex = assertThrows(
                                RuntimeException.class,
                                () -> service.pay(1));

                assertEquals(
                                "Access denied",
                                ex.getMessage());
        }

        @Test
        void checkout_success() {

                OrderRequest request = new OrderRequest();

                request.setOrderReceiver("Nguyen Van A");
                request.setOrderReceiverPhone("0123456789");
                request.setPaymentMethodId(1);
                request.setProductIds(List.of(10));

                Cart cart = new Cart();
                cart.setCartId(1);

                PaymentMethod paymentMethod = paymentMethod(false);

                Product product = new Product();

                product.setProductId(10);
                product.setProductName("Green Tea");
                product.setProductPrice(100f);
                product.setInventory(20);

                CartItem cartItem = new CartItem();

                cartItem.setId(
                                new CartItemId(1, 10));

                cartItem.setQuantity(2);

                when(cartRepository
                                .findByCustomerUserId(1))
                                .thenReturn(Optional.of(cart));

                when(paymentMethodRepository
                                .findById(1))
                                .thenReturn(Optional.of(paymentMethod));

                when(orderStatusRepository
                                .findByOrderStatusName("PENDING"))
                                .thenReturn(Optional.of(
                                                orderStatus("PENDING")));

                when(paymentStatusRepository
                                .findByPaymentStatusName("UNPAID"))
                                .thenReturn(Optional.of(
                                                paymentStatus("UNPAID")));

                when(cartItemRepository
                                .findById(new CartItemId(1, 10)))
                                .thenReturn(Optional.of(cartItem));

                when(productRepository.findById(10))
                                .thenReturn(Optional.of(product));

                when(orderRepository.save(any(Order.class)))
                                .thenAnswer(inv -> inv.getArgument(0));

                CheckoutResponse result = service.checkout(request);

                assertNotNull(result);

                assertEquals(
                                18,
                                product.getInventory());

                verify(productRepository)
                                .save(product);

                verify(cartItemRepository)
                                .delete(cartItem);

                verify(invoiceRepository)
                                .save(any(Invoice.class));
        }

        @Test
        void checkout_noProductsSelected_fail() {

                OrderRequest request = new OrderRequest();

                request.setOrderReceiver("A");
                request.setOrderReceiverPhone("0123456789");
                request.setPaymentMethodId(1);
                request.setProductIds(List.of());

                Cart cart = new Cart();
                cart.setCartId(1);

                when(cartRepository
                                .findByCustomerUserId(1))
                                .thenReturn(Optional.of(cart));

                when(paymentMethodRepository
                                .findById(1))
                                .thenReturn(Optional.of(
                                                paymentMethod(false)));

                when(orderStatusRepository
                                .findByOrderStatusName("PENDING"))
                                .thenReturn(Optional.of(
                                                orderStatus("PENDING")));

                when(paymentStatusRepository
                                .findByPaymentStatusName("UNPAID"))
                                .thenReturn(Optional.of(
                                                paymentStatus("UNPAID")));

                RuntimeException ex = assertThrows(
                                RuntimeException.class,
                                () -> service.checkout(request));

                assertEquals(
                                "No products selected",
                                ex.getMessage());
        }

        @Test
        void checkout_voucherNotFound_fail() {

                OrderRequest request = new OrderRequest();

                request.setOrderReceiver("A");
                request.setOrderReceiverPhone("0123456789");
                request.setPaymentMethodId(1);
                request.setVoucherId(99);
                request.setProductIds(List.of(10));

                Cart cart = new Cart();

                when(cartRepository
                                .findByCustomerUserId(1))
                                .thenReturn(Optional.of(cart));

                when(paymentMethodRepository
                                .findById(1))
                                .thenReturn(Optional.of(
                                                paymentMethod(false)));

                when(voucherRepository
                                .findById(99))
                                .thenReturn(Optional.empty());

                RuntimeException ex = assertThrows(
                                RuntimeException.class,
                                () -> service.checkout(request));

                assertEquals(
                                "Voucher not found",
                                ex.getMessage());
        }
}
