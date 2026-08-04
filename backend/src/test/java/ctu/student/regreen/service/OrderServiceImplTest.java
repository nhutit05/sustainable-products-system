package ctu.student.regreen.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
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
import ctu.student.regreen.integration.payos.dto.PayOSCheckoutResult;
import ctu.student.regreen.integration.payos.service.PayOSService;
import ctu.student.regreen.mapper.OrderMapper;
import ctu.student.regreen.model.Address;
import ctu.student.regreen.model.Cart;
import ctu.student.regreen.model.CartItem;
import ctu.student.regreen.model.CartItemId;
import ctu.student.regreen.model.City;
import ctu.student.regreen.model.Customer;
import ctu.student.regreen.model.Invoice;
import ctu.student.regreen.model.Order;
import ctu.student.regreen.model.OrderItem;
import ctu.student.regreen.model.OrderStatus;
import ctu.student.regreen.model.PaymentMethod;
import ctu.student.regreen.model.PaymentStatus;
import ctu.student.regreen.model.Product;
import ctu.student.regreen.model.Village;
import ctu.student.regreen.model.Voucher;
import ctu.student.regreen.repository.AddressRepository;
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
import ctu.student.regreen.service.interfaces.NotificationService;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {

    @Mock private OrderRepository orderRepository;
    @Mock private CustomerRepository customerRepository;
    @Mock private ProductRepository productRepository;
    @Mock private CartRepository cartRepository;
    @Mock private CartItemRepository cartItemRepository;
    @Mock private PaymentMethodRepository paymentMethodRepository;
    @Mock private VoucherRepository voucherRepository;
    @Mock private OrderStatusRepository orderStatusRepository;
    @Mock private PaymentStatusRepository paymentStatusRepository;
    @Mock private AddressRepository addressRepository;
    @Mock private InvoiceRepository invoiceRepository;
    @Mock private OrderMapper orderMapper;
    @Mock private PayOSService payOSService;
    @Mock private NotificationService notificationService;

    @InjectMocks
    private OrderServiceImpl service;

    private Customer customer;
    private Order order;
    private OrderResponse response;

    private static final Integer CUSTOMER_ID = 1;
    private static final Integer ORDER_ID = 1;
    private static final String USERNAME = "testuser";

    @BeforeEach
    void setUp() {

        Authentication authentication =
                mock(Authentication.class);

        SecurityContext securityContext =
                mock(SecurityContext.class);

        when(authentication.getName())
                .thenReturn(USERNAME);

        when(securityContext.getAuthentication())
                .thenReturn(authentication);

        SecurityContextHolder.setContext(
                securityContext);

        customer = new Customer();
        customer.setUserId(CUSTOMER_ID);
        customer.setUsername(USERNAME);

        when(customerRepository.findByUsername(USERNAME))
                .thenReturn(Optional.of(customer));

        order = new Order();
        order.setOrderId(ORDER_ID);
        order.setCustomer(customer);

        response = new OrderResponse();
        response.setOrderId(ORDER_ID);

        lenient()
                .when(orderMapper.toResponse(any(Order.class)))
                .thenReturn(response);
    }

    @AfterEach
    void tearDown() {

        SecurityContextHolder.clearContext();
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

    private Address createAddress() {

        City city = new City();
        city.setCityId(1);
        city.setCityName("HCM");

        Village village = new Village();
        village.setVillageId(1);
        village.setVillageName("Phuong 1");
        village.setCity(city);

        Address address = new Address();
        address.setAddressId(1);
        address.setAddressName("Home");
        address.setAddressStreet("3/2");
        address.setCustomer(customer);
        address.setVillage(village);

        return address;
    }

    // ==================== getMyOrders ====================

    @Test
    void getMyOrders_success() {

        order.setCustomer(customer);

        when(orderRepository
                .findByCustomerUserIdWithDetails(CUSTOMER_ID))
                .thenReturn(List.of(order));

        List<OrderResponse> result =
                service.getMyOrders();

        assertEquals(1, result.size());

        verify(customerRepository).findByUsername(USERNAME);
        verify(orderRepository)
                .findByCustomerUserIdWithDetails(CUSTOMER_ID);
        verify(orderMapper).toResponse(order);
    }

    @Test
    void getMyOrders_empty_returnsEmptyList() {

        when(orderRepository
                .findByCustomerUserIdWithDetails(CUSTOMER_ID))
                .thenReturn(Collections.emptyList());

        List<OrderResponse> result =
                service.getMyOrders();

        assertTrue(result.isEmpty());
        verify(orderMapper, never()).toResponse(any());
    }

    @Test
    void getMyOrders_customerNotFound_throwsException() {

        when(customerRepository.findByUsername(USERNAME))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.getMyOrders());

        assertEquals("Customer not found", ex.getMessage());
    }

    // ==================== getById ====================

    @Test
    void getById_success() {

        order.setCustomer(customer);

        when(orderRepository.findByIdWithDetails(ORDER_ID))
                .thenReturn(Optional.of(order));

        OrderResponse result =
                service.getById(ORDER_ID);

        assertNotNull(result);
        assertEquals(ORDER_ID, result.getOrderId());

        verify(customerRepository).findByUsername(USERNAME);
        verify(orderRepository).findByIdWithDetails(ORDER_ID);
        verify(orderMapper).toResponse(order);
    }

    @Test
    void getById_orderNotFound_throwsException() {

        when(orderRepository.findByIdWithDetails(ORDER_ID))
                .thenReturn(Optional.empty());

        assertThrows(
                RuntimeException.class,
                () -> service.getById(ORDER_ID));

        verify(orderMapper, never()).toResponse(any());
    }

    @Test
    void getById_accessDenied_throwsException() {

        Customer anotherCustomer = new Customer();
        anotherCustomer.setUserId(999);

        order.setCustomer(anotherCustomer);

        when(orderRepository.findByIdWithDetails(ORDER_ID))
                .thenReturn(Optional.of(order));

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.getById(ORDER_ID));

        assertEquals("Access denied", ex.getMessage());

        verify(orderMapper, never()).toResponse(any());
    }

    @Test
    void getById_customerNotFound_throwsException() {

        when(customerRepository.findByUsername(USERNAME))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.getById(ORDER_ID));

        assertEquals("Customer not found", ex.getMessage());
    }

    // ==================== cancel ====================

    @Test
    void cancel_pending_success() {

        Product product = new Product();
        product.setProductId(10);
        product.setInventory(10);

        OrderItem item = new OrderItem();
        item.setOrder(order);
        item.setProduct(product);
        item.setQuantity(2);
        item.setPurchasedPrice(100f);

        order.setCustomer(customer);
        order.setOrderItems(List.of(item));
        order.setOrderStatus(orderStatus("PENDING"));

        when(orderRepository.findByIdWithDetails(ORDER_ID))
                .thenReturn(Optional.of(order));

        when(orderStatusRepository
                .findByOrderStatusName("CANCELLED"))
                .thenReturn(Optional.of(
                        orderStatus("CANCELLED")));

        when(orderRepository.save(any(Order.class)))
                .thenReturn(order);

        OrderResponse cancelResponse = new OrderResponse();
        cancelResponse.setOrderId(ORDER_ID);

        when(orderMapper.toResponse(order))
                .thenReturn(cancelResponse);

        OrderResponse result = service.cancel(ORDER_ID);

        assertNotNull(result);
        assertEquals(12, product.getInventory());
        assertEquals("CANCELLED",
                order.getOrderStatus().getOrderStatusName());

        verify(orderRepository).save(order);
        verify(orderMapper).toResponse(order);
    }

    @Test
    void cancel_alreadyCancelled_throwsException() {

        order.setCustomer(customer);
        order.setOrderStatus(orderStatus("CANCELLED"));

        when(orderRepository.findByIdWithDetails(ORDER_ID))
                .thenReturn(Optional.of(order));

        when(orderStatusRepository
                .findByOrderStatusName("CANCELLED"))
                .thenReturn(Optional.of(
                        orderStatus("CANCELLED")));

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.cancel(ORDER_ID));

        assertEquals(
                "Order already cancelled",
                ex.getMessage());

        verify(orderRepository, never()).save(any());
    }

    @Test
    void cancel_notPending_throwsException() {

        order.setCustomer(customer);
        order.setOrderStatus(orderStatus("SHIPPING"));

        when(orderRepository.findByIdWithDetails(ORDER_ID))
                .thenReturn(Optional.of(order));

        when(orderStatusRepository
                .findByOrderStatusName("CANCELLED"))
                .thenReturn(Optional.of(
                        orderStatus("CANCELLED")));

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.cancel(ORDER_ID));

        assertEquals(
                "Order cannot be cancelled",
                ex.getMessage());

        verify(orderRepository, never()).save(any());
    }

    @Test
    void cancel_orderNotFound_throwsException() {

        when(orderRepository.findByIdWithDetails(ORDER_ID))
                .thenReturn(Optional.empty());

        assertThrows(
                RuntimeException.class,
                () -> service.cancel(ORDER_ID));

        verify(orderRepository, never()).save(any());
    }

    @Test
    void cancel_accessDenied_throwsException() {

        Customer anotherCustomer = new Customer();
        anotherCustomer.setUserId(999);

        order.setCustomer(anotherCustomer);
        order.setOrderStatus(orderStatus("PENDING"));

        when(orderRepository.findByIdWithDetails(ORDER_ID))
                .thenReturn(Optional.of(order));

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.cancel(ORDER_ID));

        assertEquals("Access denied", ex.getMessage());

        verify(orderRepository, never()).save(any());
    }

    @Test
    void cancel_customerNotFound_throwsException() {

        when(customerRepository.findByUsername(USERNAME))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.cancel(ORDER_ID));

        assertEquals("Customer not found", ex.getMessage());
    }

    // ==================== pay ====================

    @Test
    void pay_online_success() {

        order.setCustomer(customer);
        order.setPaymentMethod(paymentMethod(true));

        when(orderRepository.findById(ORDER_ID))
                .thenReturn(Optional.of(order));

        when(paymentStatusRepository
                .findByPaymentStatusName("PAID"))
                .thenReturn(Optional.of(
                        paymentStatus("PAID")));

        when(orderRepository.save(any(Order.class)))
                .thenReturn(order);

        OrderResponse payResponse = new OrderResponse();
        payResponse.setOrderId(ORDER_ID);

        when(orderMapper.toResponse(order))
                .thenReturn(payResponse);

        OrderResponse result = service.pay(ORDER_ID);

        assertNotNull(result);
        assertEquals("PAID",
                order.getPaymentStatus().getPaymentStatusName());

        verify(orderRepository).save(order);
        verify(orderMapper).toResponse(order);
    }

    @Test
    void pay_cod_throwsException() {

        order.setCustomer(customer);
        order.setPaymentMethod(paymentMethod(false));

        when(orderRepository.findById(ORDER_ID))
                .thenReturn(Optional.of(order));

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.pay(ORDER_ID));

        assertEquals(
                "COD order cannot be paid online",
                ex.getMessage());

        verify(orderRepository, never()).save(any());
    }

    @Test
    void pay_accessDenied_throwsException() {

        Customer anotherCustomer = new Customer();
        anotherCustomer.setUserId(99);

        order.setCustomer(anotherCustomer);
        order.setPaymentMethod(paymentMethod(true));

        when(orderRepository.findById(ORDER_ID))
                .thenReturn(Optional.of(order));

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.pay(ORDER_ID));

        assertEquals("Access denied", ex.getMessage());

        verify(orderRepository, never()).save(any());
    }

    @Test
    void pay_orderNotFound_throwsException() {

        when(orderRepository.findById(ORDER_ID))
                .thenReturn(Optional.empty());

        assertThrows(
                RuntimeException.class,
                () -> service.pay(ORDER_ID));

        verify(orderRepository, never()).save(any());
    }

    @Test
    void pay_customerNotFound_throwsException() {

        when(customerRepository.findByUsername(USERNAME))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.pay(ORDER_ID));

        assertEquals("Customer not found", ex.getMessage());
    }

    // ==================== checkout ====================

    private void stubCheckoutBase() {

        Address address = createAddress();

        lenient().when(addressRepository.findById(1))
                .thenReturn(Optional.of(address));

        lenient().when(orderStatusRepository
                .findByOrderStatusName("PENDING"))
                .thenReturn(Optional.of(orderStatus("PENDING")));

        lenient().when(paymentStatusRepository
                .findByPaymentStatusName("UNPAID"))
                .thenReturn(Optional.of(paymentStatus("UNPAID")));
    }

    private Cart setupCart() {

        Cart cart = new Cart();
        cart.setCartId(1);

        when(cartRepository.findByCustomerUserId(CUSTOMER_ID))
                .thenReturn(Optional.of(cart));

        return cart;
    }

    @Test
    void checkout_cod_success() {

        OrderRequest request = new OrderRequest();
        request.setOrderReceiver("Nguyen Van A");
        request.setOrderReceiverPhone("0123456789");
        request.setPaymentMethodId(1);
        request.setProductIds(List.of(10));
        request.setAddressId(1);

        Cart cart = setupCart();

        Product product = new Product();
        product.setProductId(10);
        product.setProductName("Green Tea");
        product.setProductPrice(100f);
        product.setInventory(20);
        product.setBaseEcoPoints(10);

        CartItem cartItem = new CartItem();
        cartItem.setId(new CartItemId(1, 10));
        cartItem.setCart(cart);
        cartItem.setProduct(product);
        cartItem.setQuantity(2);

        when(paymentMethodRepository.findById(1))
                .thenReturn(Optional.of(paymentMethod(false)));

        stubCheckoutBase();

        when(cartItemRepository
                .findByCartCartIdWithProduct(1))
                .thenReturn(List.of(cartItem));

        when(productRepository
                .findAllWithCategoryByIdIn(List.of(10)))
                .thenReturn(List.of(product));

        when(orderRepository.save(any(Order.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        when(orderMapper.toResponse(any(Order.class)))
                .thenReturn(response);

        CheckoutResponse result =
                service.checkout(request);

        assertNotNull(result);
        assertEquals(18, product.getInventory());

        verify(productRepository).save(product);
        verify(cartItemRepository).delete(cartItem);
        verify(invoiceRepository).save(any(Invoice.class));
        verify(notificationService)
                .notifyNewOrderToAdmins(any(Order.class));
    }

    @Test
    void checkout_onlinePayment_success() {

        OrderRequest request = new OrderRequest();
        request.setOrderReceiver("Nguyen Van A");
        request.setOrderReceiverPhone("0123456789");
        request.setPaymentMethodId(1);
        request.setProductIds(List.of(10));
        request.setAddressId(1);

        Cart cart = setupCart();

        Product product = new Product();
        product.setProductId(10);
        product.setProductName("Green Tea");
        product.setProductPrice(100f);
        product.setInventory(20);
        product.setBaseEcoPoints(10);

        CartItem cartItem = new CartItem();
        cartItem.setId(new CartItemId(1, 10));
        cartItem.setCart(cart);
        cartItem.setProduct(product);
        cartItem.setQuantity(2);

        PayOSCheckoutResult payOSResult =
                PayOSCheckoutResult.builder()
                        .payOSOrderCode(12345L)
                        .checkoutUrl("https://pay.payos.vn/abc")
                        .qrCode("qr-data")
                        .expiredAt(LocalDateTime.now().plusMinutes(15))
                        .build();

        when(paymentMethodRepository.findById(1))
                .thenReturn(Optional.of(paymentMethod(true)));

        stubCheckoutBase();

        when(cartItemRepository
                .findByCartCartIdWithProduct(1))
                .thenReturn(List.of(cartItem));

        when(productRepository
                .findAllWithCategoryByIdIn(List.of(10)))
                .thenReturn(List.of(product));

        when(orderRepository.save(any(Order.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        when(payOSService.createCheckout(
                any(Order.class), anyLong()))
                .thenReturn(payOSResult);

        when(orderMapper.toResponse(any(Order.class)))
                .thenReturn(response);

        CheckoutResponse result =
                service.checkout(request);

        assertNotNull(result);
        assertNotNull(result.getCheckoutUrl());
        assertEquals("https://pay.payos.vn/abc",
                result.getCheckoutUrl());

        verify(payOSService).createCheckout(
                any(Order.class), anyLong());
        verify(invoiceRepository).save(any(Invoice.class));
    }

    @Test
    void checkout_withVoucher_success() {

        OrderRequest request = new OrderRequest();
        request.setOrderReceiver("Nguyen Van A");
        request.setOrderReceiverPhone("0123456789");
        request.setPaymentMethodId(1);
        request.setVoucherId(1);
        request.setProductIds(List.of(10));
        request.setAddressId(1);

        Cart cart = setupCart();

        Voucher voucher = new Voucher();
        voucher.setVoucherId(1);
        voucher.setDiscountValue(10f);
        voucher.setQuantity(10);
        voucher.setStartedAt(java.time.LocalDate.now());
        voucher.setExpiredAt(java.time.LocalDate.now().plusDays(10));

        Product product = new Product();
        product.setProductId(10);
        product.setProductName("Green Tea");
        product.setProductPrice(100f);
        product.setInventory(20);
        product.setBaseEcoPoints(10);

        CartItem cartItem = new CartItem();
        cartItem.setId(new CartItemId(1, 10));
        cartItem.setCart(cart);
        cartItem.setProduct(product);
        cartItem.setQuantity(2);

        when(paymentMethodRepository.findById(1))
                .thenReturn(Optional.of(paymentMethod(false)));

        when(voucherRepository
                .findByVoucherIdAndIsActiveTrue(1))
                .thenReturn(Optional.of(voucher));

        stubCheckoutBase();

        when(cartItemRepository
                .findByCartCartIdWithProduct(1))
                .thenReturn(List.of(cartItem));

        when(productRepository
                .findAllWithCategoryByIdIn(List.of(10)))
                .thenReturn(List.of(product));

        when(orderRepository.save(any(Order.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        when(orderMapper.toResponse(any(Order.class)))
                .thenReturn(response);

        CheckoutResponse result =
                service.checkout(request);

        assertNotNull(result);
        assertEquals(9, voucher.getQuantity());
        assertEquals(18, product.getInventory());

        verify(voucherRepository)
                .findByVoucherIdAndIsActiveTrue(1);
    }

    @Test
    void checkout_noProductsSelected_throwsException() {

        OrderRequest request = new OrderRequest();
        request.setOrderReceiver("A");
        request.setOrderReceiverPhone("0123456789");
        request.setPaymentMethodId(1);
        request.setProductIds(List.of());
        request.setAddressId(1);

        setupCart();

        when(paymentMethodRepository.findById(1))
                .thenReturn(Optional.of(paymentMethod(false)));

        stubCheckoutBase();

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.checkout(request));

        assertEquals("No products selected", ex.getMessage());
    }

    @Test
    void checkout_voucherNotFound_throwsException() {

        OrderRequest request = new OrderRequest();
        request.setOrderReceiver("A");
        request.setOrderReceiverPhone("0123456789");
        request.setPaymentMethodId(1);
        request.setVoucherId(99);
        request.setProductIds(List.of(10));
        request.setAddressId(1);

        setupCart();

        when(paymentMethodRepository.findById(1))
                .thenReturn(Optional.of(paymentMethod(false)));

        when(voucherRepository
                .findByVoucherIdAndIsActiveTrue(99))
                .thenReturn(Optional.empty());

        stubCheckoutBase();

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.checkout(request));

        assertEquals("Voucher not found", ex.getMessage());
    }

    @Test
    void checkout_outOfStock_throwsException() {

        OrderRequest request = new OrderRequest();
        request.setOrderReceiver("A");
        request.setOrderReceiverPhone("0123456789");
        request.setPaymentMethodId(1);
        request.setProductIds(List.of(10));
        request.setAddressId(1);

        Cart cart = setupCart();

        Product product = new Product();
        product.setProductId(10);
        product.setProductName("Green Tea");
        product.setInventory(2);

        CartItem cartItem = new CartItem();
        cartItem.setId(new CartItemId(1, 10));
        cartItem.setCart(cart);
        cartItem.setProduct(product);
        cartItem.setQuantity(5);

        when(paymentMethodRepository.findById(1))
                .thenReturn(Optional.of(paymentMethod(false)));

        stubCheckoutBase();

        when(cartItemRepository
                .findByCartCartIdWithProduct(1))
                .thenReturn(List.of(cartItem));

        when(productRepository
                .findAllWithCategoryByIdIn(List.of(10)))
                .thenReturn(List.of(product));

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.checkout(request));

        assertEquals(
                "Green Tea is out of stock",
                ex.getMessage());

        verify(orderRepository, never()).save(any());
    }

    @Test
    void checkout_cartNotFound_throwsException() {

        OrderRequest request = new OrderRequest();
        request.setOrderReceiver("A");
        request.setOrderReceiverPhone("0123456789");
        request.setPaymentMethodId(1);
        request.setProductIds(List.of(10));
        request.setAddressId(1);

        when(cartRepository.findByCustomerUserId(CUSTOMER_ID))
                .thenReturn(Optional.empty());

        assertThrows(
                RuntimeException.class,
                () -> service.checkout(request));

        verify(orderRepository, never()).save(any());
    }

    @Test
    void checkout_addressNotFound_throwsException() {

        OrderRequest request = new OrderRequest();
        request.setOrderReceiver("A");
        request.setOrderReceiverPhone("0123456789");
        request.setPaymentMethodId(1);
        request.setProductIds(List.of(10));
        request.setAddressId(1);

        setupCart();

        when(paymentMethodRepository.findById(1))
                .thenReturn(Optional.of(paymentMethod(false)));

        when(addressRepository.findById(1))
                .thenReturn(Optional.empty());

        when(orderStatusRepository
                .findByOrderStatusName("PENDING"))
                .thenReturn(Optional.of(orderStatus("PENDING")));

        when(paymentStatusRepository
                .findByPaymentStatusName("UNPAID"))
                .thenReturn(Optional.of(paymentStatus("UNPAID")));

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.checkout(request));

        assertEquals("Address not found", ex.getMessage());
    }

    @Test
    void checkout_productNotFound_throwsException() {

        OrderRequest request = new OrderRequest();
        request.setOrderReceiver("A");
        request.setOrderReceiverPhone("0123456789");
        request.setPaymentMethodId(1);
        request.setProductIds(List.of(10));
        request.setAddressId(1);

        Cart cart = setupCart();

        CartItem cartItem = new CartItem();
        cartItem.setId(new CartItemId(1, 10));
        cartItem.setCart(cart);
        cartItem.setQuantity(2);

        when(paymentMethodRepository.findById(1))
                .thenReturn(Optional.of(paymentMethod(false)));

        stubCheckoutBase();

        when(cartItemRepository
                .findByCartCartIdWithProduct(1))
                .thenReturn(List.of(cartItem));

        when(productRepository
                .findAllWithCategoryByIdIn(List.of(10)))
                .thenReturn(Collections.emptyList());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.checkout(request));

        assertEquals("Product not found", ex.getMessage());

        verify(orderRepository, never()).save(any());
    }

    @Test
    void checkout_cartItemNotFound_throwsException() {

        OrderRequest request = new OrderRequest();
        request.setOrderReceiver("A");
        request.setOrderReceiverPhone("0123456789");
        request.setPaymentMethodId(1);
        request.setProductIds(List.of(10));
        request.setAddressId(1);

        Cart cart = setupCart();

        Product product = new Product();
        product.setProductId(10);
        product.setProductName("Green Tea");
        product.setInventory(20);

        when(paymentMethodRepository.findById(1))
                .thenReturn(Optional.of(paymentMethod(false)));

        stubCheckoutBase();

        when(cartItemRepository
                .findByCartCartIdWithProduct(1))
                .thenReturn(Collections.emptyList());

        when(productRepository
                .findAllWithCategoryByIdIn(List.of(10)))
                .thenReturn(List.of(product));

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.checkout(request));

        assertEquals("Cart item not found", ex.getMessage());

        verify(orderRepository, never()).save(any());
    }

    @Test
    void checkout_customerNotFound_throwsException() {

        when(customerRepository.findByUsername(USERNAME))
                .thenReturn(Optional.empty());

        OrderRequest request = new OrderRequest();
        request.setProductIds(List.of(10));

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.checkout(request));

        assertEquals("Customer not found", ex.getMessage());
    }
}
