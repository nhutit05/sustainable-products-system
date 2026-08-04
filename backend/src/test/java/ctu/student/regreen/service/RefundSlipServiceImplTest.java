package ctu.student.regreen.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
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

import ctu.student.regreen.dto.request.RefundSlipRequest;
import ctu.student.regreen.dto.response.RefundSlipResponse;
import ctu.student.regreen.mapper.RefundSlipMapper;
import ctu.student.regreen.model.Bank;
import ctu.student.regreen.model.Customer;
import ctu.student.regreen.model.Order;
import ctu.student.regreen.model.OrderStatus;
import ctu.student.regreen.model.RefundSlip;
import ctu.student.regreen.model.RefundStatus;
import ctu.student.regreen.repository.BankRepository;
import ctu.student.regreen.repository.CustomerRepository;
import ctu.student.regreen.repository.OrderRepository;
import ctu.student.regreen.repository.RefundSlipRepository;
import ctu.student.regreen.repository.RefundStatusRepository;
import ctu.student.regreen.service.implement.RefundSlipServiceImpl;
import ctu.student.regreen.service.interfaces.NotificationService;

@ExtendWith(MockitoExtension.class)
class RefundSlipServiceImplTest {

    @Mock
    private RefundSlipRepository refundSlipRepository;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private BankRepository bankRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private RefundStatusRepository refundStatusRepository;

    @Mock
    private RefundSlipMapper refundSlipMapper;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private RefundSlipServiceImpl service;

    private Customer customer;
    private Order order;
    private RefundSlip refundSlip;

    @BeforeEach
    void setUp() {

        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);

        when(authentication.getName())
                .thenReturn("testuser");
        when(securityContext.getAuthentication())
                .thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        customer = new Customer();
        customer.setUserId(1);

        order = new Order();
        order.setOrderId(1);
        order.setCustomer(customer);

        refundSlip = new RefundSlip();

        lenient()
                .when(customerRepository.findByUsername("testuser"))
                .thenReturn(Optional.of(customer));
    }

    @Test
    void create_success() {

        RefundSlipRequest request = new RefundSlipRequest();
        request.setOrderId(1);
        request.setBankId("BIDV");
        request.setBankNumber("123456");
        request.setAccountBankName("NGUYEN VAN A");
        request.setReason("Wrong product");

        order.setOrderStatus(refundOrderStatus("COMPLETED"));

        Bank bank = new Bank();
        bank.setBankId("BIDV");

        RefundStatus pending = refundStatus("PENDING");

        RefundSlipResponse expectedResponse = new RefundSlipResponse(
                1, "123456", "NGUYEN VAN A", "Wrong product",
                1, "BIDV", "BIDV", 1, "PENDING", null, null);

        when(refundSlipRepository.existsByOrderOrderId(1))
                .thenReturn(false);
        when(orderRepository.findById(1))
                .thenReturn(Optional.of(order));
        when(bankRepository.findById("BIDV"))
                .thenReturn(Optional.of(bank));
        when(refundStatusRepository
                .findByRefundStatusName("PENDING"))
                .thenReturn(Optional.of(pending));
        when(refundSlipRepository.save(any()))
                .thenAnswer(inv -> inv.getArgument(0));
        when(refundSlipMapper.toResponse(any()))
                .thenReturn(expectedResponse);

        RefundSlipResponse result = service.create(request);

        assertNotNull(result);
        assertEquals("123456", result.getBankNumber());
        assertEquals("NGUYEN VAN A", result.getAccountBankName());
        verify(refundSlipRepository).save(any(RefundSlip.class));
        verify(notificationService).notifyNewRefundToAdmins(any(RefundSlip.class));
    }

    @Test
    void create_orderAlreadyHasRefund_fail() {

        RefundSlipRequest request = new RefundSlipRequest();
        request.setOrderId(1);

        when(refundSlipRepository.existsByOrderOrderId(1))
                .thenReturn(true);

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.create(request));

        assertEquals("Order already exists", ex.getMessage());
    }

    @Test
    void create_orderNotFound_fail() {

        RefundSlipRequest request = new RefundSlipRequest();
        request.setOrderId(1);

        when(refundSlipRepository.existsByOrderOrderId(1))
                .thenReturn(false);
        when(orderRepository.findById(1))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.create(request));

        assertEquals("Order not found", ex.getMessage());
    }

    @Test
    void create_accessDenied_fail() {

        Customer another = new Customer();
        another.setUserId(99);
        order.setCustomer(another);

        RefundSlipRequest request = new RefundSlipRequest();
        request.setOrderId(1);

        when(refundSlipRepository.existsByOrderOrderId(1))
                .thenReturn(false);
        when(orderRepository.findById(1))
                .thenReturn(Optional.of(order));

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.create(request));

        assertEquals("Access denied", ex.getMessage());
    }

    @Test
    void create_orderNotCompleted_fail() {

        order.setOrderStatus(refundOrderStatus("SHIPPING"));

        RefundSlipRequest request = new RefundSlipRequest();
        request.setOrderId(1);

        when(refundSlipRepository.existsByOrderOrderId(1))
                .thenReturn(false);
        when(orderRepository.findById(1))
                .thenReturn(Optional.of(order));

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.create(request));

        assertEquals("Only completed orders can be refunded", ex.getMessage());
    }

    @Test
    void create_bankNotFound_fail() {

        order.setOrderStatus(refundOrderStatus("COMPLETED"));

        RefundSlipRequest request = new RefundSlipRequest();
        request.setOrderId(1);
        request.setBankId("BIDV");

        when(refundSlipRepository.existsByOrderOrderId(1))
                .thenReturn(false);
        when(orderRepository.findById(1))
                .thenReturn(Optional.of(order));
        when(bankRepository.findById("BIDV"))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.create(request));

        assertEquals("Bank not found", ex.getMessage());
    }

    @Test
    void create_refundStatusNotFound_fail() {

        order.setOrderStatus(refundOrderStatus("COMPLETED"));

        Bank bank = new Bank();
        bank.setBankId("BIDV");

        RefundSlipRequest request = new RefundSlipRequest();
        request.setOrderId(1);
        request.setBankId("BIDV");

        when(refundSlipRepository.existsByOrderOrderId(1))
                .thenReturn(false);
        when(orderRepository.findById(1))
                .thenReturn(Optional.of(order));
        when(bankRepository.findById("BIDV"))
                .thenReturn(Optional.of(bank));
        when(refundStatusRepository
                .findByRefundStatusName("PENDING"))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.create(request));

        assertEquals("Refund status not found", ex.getMessage());
    }

    @Test
    void getById_success() {

        refundSlip.setOrder(order);

        RefundSlipResponse expectedResponse = new RefundSlipResponse(
                1, null, null, null,
                1, null, null, 1, "PENDING", null, null);

        when(refundSlipRepository.findById(1))
                .thenReturn(Optional.of(refundSlip));
        when(refundSlipMapper.toResponse(any()))
                .thenReturn(expectedResponse);

        RefundSlipResponse result = service.getById(1);

        assertNotNull(result);
        verify(refundSlipMapper).toResponse(refundSlip);
    }

    @Test
    void getById_notFound_fail() {

        when(refundSlipRepository.findById(999))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.getById(999));

        assertEquals("Refund slip not found", ex.getMessage());
    }

    @Test
    void getById_accessDenied_fail() {

        Customer another = new Customer();
        another.setUserId(99);
        order.setCustomer(another);

        refundSlip.setOrder(order);

        when(refundSlipRepository.findById(1))
                .thenReturn(Optional.of(refundSlip));

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.getById(1));

        assertEquals("Access denied", ex.getMessage());
    }

    @Test
    void getByOrder_success() {

        refundSlip.setOrder(order);

        RefundSlipResponse expectedResponse = new RefundSlipResponse(
                1, null, null, null,
                1, null, null, 1, "PENDING", null, null);

        when(refundSlipRepository.findByOrderOrderId(1))
                .thenReturn(Optional.of(refundSlip));
        when(refundSlipMapper.toResponse(any()))
                .thenReturn(expectedResponse);

        RefundSlipResponse result = service.getByOrder(1);

        assertNotNull(result);
        verify(refundSlipMapper).toResponse(refundSlip);
    }

    @Test
    void getByOrder_notFound_fail() {

        when(refundSlipRepository.findByOrderOrderId(999))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.getByOrder(999));

        assertEquals("Refund slip not found", ex.getMessage());
    }

    @Test
    void getByOrder_accessDenied_fail() {

        Customer another = new Customer();
        another.setUserId(99);
        order.setCustomer(another);

        refundSlip.setOrder(order);

        when(refundSlipRepository.findByOrderOrderId(1))
                .thenReturn(Optional.of(refundSlip));

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.getByOrder(1));

        assertEquals("Access denied", ex.getMessage());
    }

    @Test
    void getMyRefundSlips_success() {

        RefundSlip slip1 = new RefundSlip();
        slip1.setOrder(order);

        RefundSlipResponse expectedResponse = new RefundSlipResponse(
                1, null, null, null,
                1, null, null, 1, "PENDING", null, null);

        when(refundSlipRepository.findByOrderCustomerUserId(1))
                .thenReturn(List.of(slip1));
        when(refundSlipMapper.toResponse(slip1))
                .thenReturn(expectedResponse);

        List<RefundSlipResponse> result = service.getMyRefundSlips();

        assertEquals(1, result.size());
        verify(refundSlipMapper).toResponse(slip1);
    }

    @Test
    void getMyRefundSlips_empty() {

        when(refundSlipRepository.findByOrderCustomerUserId(1))
                .thenReturn(List.of());

        List<RefundSlipResponse> result = service.getMyRefundSlips();

        assertTrue(result.isEmpty());
    }

    private OrderStatus refundOrderStatus(String name) {

        OrderStatus status = new OrderStatus();
        status.setOrderStatusName(name);
        return status;
    }

    private RefundStatus refundStatus(String name) {

        RefundStatus status = new RefundStatus();
        status.setRefundStatusName(name);
        return status;
    }
}
