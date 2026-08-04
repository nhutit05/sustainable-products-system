package ctu.student.regreen.service;

import ctu.student.regreen.dto.response.InvoiceResponse;
import ctu.student.regreen.mapper.InvoiceMapper;
import ctu.student.regreen.model.Customer;
import ctu.student.regreen.model.Invoice;
import ctu.student.regreen.model.Order;
import ctu.student.regreen.repository.CustomerRepository;
import ctu.student.regreen.repository.InvoiceRepository;
import ctu.student.regreen.service.implement.InvoiceServiceImpl;

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

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InvoiceServiceImplTest {

    @Mock
    private InvoiceRepository invoiceRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private InvoiceMapper invoiceMapper;

    @InjectMocks
    private InvoiceServiceImpl service;

    private Customer customer;
    private Order order;
    private Invoice invoice;
    private InvoiceResponse response;

    private static final Integer CUSTOMER_ID = 1;
    private static final Integer ORDER_ID = 1;
    private static final Integer INVOICE_ID = 1;
    private static final String USERNAME = "testuser";
    private static final LocalDateTime CREATED_AT =
            LocalDateTime.of(2025, 6, 1, 10, 0);
    private static final Float TOTAL = 200_000f;
    private static final Float DISCOUNT = 20_000f;
    private static final Float FINAL = 180_000f;

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

        order = new Order();
        order.setOrderId(ORDER_ID);
        order.setCustomer(customer);

        invoice = new Invoice();
        invoice.setInvoiceId(INVOICE_ID);
        invoice.setCreatedAt(CREATED_AT);
        invoice.setOrder(order);

        response = new InvoiceResponse(
                INVOICE_ID,
                CREATED_AT,
                ORDER_ID,
                "Nguyen Van A",
                "0901234567",
                TOTAL,
                DISCOUNT,
                FINAL);

        when(customerRepository.findByUsername(USERNAME))
                .thenReturn(Optional.of(customer));

        lenient()
                .when(invoiceMapper.toResponse(any(Invoice.class)))
                .thenReturn(response);
    }

    @AfterEach
    void tearDown() {

        SecurityContextHolder.clearContext();
    }

    // ==================== getById ====================

    @Test
    void getById_success() {

        when(invoiceRepository.findById(INVOICE_ID))
                .thenReturn(Optional.of(invoice));

        InvoiceResponse result =
                service.getById(INVOICE_ID);

        assertNotNull(result);
        assertEquals(INVOICE_ID, result.getInvoiceId());
        assertEquals(ORDER_ID, result.getOrderId());
        assertEquals(TOTAL, result.getTotalAmount());
        assertEquals(DISCOUNT, result.getDiscountAmount());
        assertEquals(FINAL, result.getFinalAmount());

        verify(customerRepository).findByUsername(USERNAME);
        verify(invoiceRepository).findById(INVOICE_ID);
        verify(invoiceMapper).toResponse(invoice);
    }

    @Test
    void getById_invoiceNotFound_throwsException() {

        when(invoiceRepository.findById(INVOICE_ID))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.getById(INVOICE_ID));

        assertEquals("Invoice not found", ex.getMessage());

        verify(invoiceMapper, never()).toResponse(any());
    }

    @Test
    void getById_accessDenied_throwsException() {

        Customer anotherCustomer = new Customer();
        anotherCustomer.setUserId(99);

        order.setCustomer(anotherCustomer);

        when(invoiceRepository.findById(INVOICE_ID))
                .thenReturn(Optional.of(invoice));

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.getById(INVOICE_ID));

        assertEquals("Access denied", ex.getMessage());

        verify(invoiceMapper, never()).toResponse(any());
    }

    @Test
    void getById_customerNotFound_throwsException() {

        when(customerRepository.findByUsername(USERNAME))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.getById(INVOICE_ID));

        assertEquals("Customer not found", ex.getMessage());

        verify(invoiceRepository, never()).findById(any());
    }

    // ==================== getByOrder ====================

    @Test
    void getByOrder_success() {

        when(invoiceRepository.findByOrderOrderId(ORDER_ID))
                .thenReturn(Optional.of(invoice));

        InvoiceResponse result =
                service.getByOrder(ORDER_ID);

        assertNotNull(result);
        assertEquals(INVOICE_ID, result.getInvoiceId());
        assertEquals(ORDER_ID, result.getOrderId());

        verify(customerRepository).findByUsername(USERNAME);
        verify(invoiceRepository).findByOrderOrderId(ORDER_ID);
        verify(invoiceMapper).toResponse(invoice);
    }

    @Test
    void getByOrder_invoiceNotFound_throwsException() {

        when(invoiceRepository.findByOrderOrderId(ORDER_ID))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.getByOrder(ORDER_ID));

        assertEquals("Invoice not found", ex.getMessage());

        verify(invoiceMapper, never()).toResponse(any());
    }

    @Test
    void getByOrder_accessDenied_throwsException() {

        Customer anotherCustomer = new Customer();
        anotherCustomer.setUserId(99);

        order.setCustomer(anotherCustomer);

        when(invoiceRepository.findByOrderOrderId(ORDER_ID))
                .thenReturn(Optional.of(invoice));

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.getByOrder(ORDER_ID));

        assertEquals("Access denied", ex.getMessage());

        verify(invoiceMapper, never()).toResponse(any());
    }

    @Test
    void getByOrder_customerNotFound_throwsException() {

        when(customerRepository.findByUsername(USERNAME))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.getByOrder(ORDER_ID));

        assertEquals("Customer not found", ex.getMessage());

        verify(invoiceRepository, never()).findByOrderOrderId(any());
    }

    // ==================== getMyInvoices ====================

    @Test
    void getMyInvoices_success() {

        when(invoiceRepository
                .findByOrderCustomerUserId(CUSTOMER_ID))
                .thenReturn(List.of(invoice));

        List<InvoiceResponse> result =
                service.getMyInvoices();

        assertEquals(1, result.size());
        assertEquals(INVOICE_ID, result.get(0).getInvoiceId());
        assertEquals(ORDER_ID, result.get(0).getOrderId());

        verify(customerRepository).findByUsername(USERNAME);
        verify(invoiceRepository)
                .findByOrderCustomerUserId(CUSTOMER_ID);
        verify(invoiceMapper).toResponse(invoice);
    }

    @Test
    void getMyInvoices_empty_returnsEmptyList() {

        when(invoiceRepository
                .findByOrderCustomerUserId(CUSTOMER_ID))
                .thenReturn(Collections.emptyList());

        List<InvoiceResponse> result =
                service.getMyInvoices();

        assertTrue(result.isEmpty());
        verify(invoiceMapper, never()).toResponse(any());
    }

    @Test
    void getMyInvoices_customerNotFound_throwsException() {

        when(customerRepository.findByUsername(USERNAME))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.getMyInvoices());

        assertEquals("Customer not found", ex.getMessage());

        verify(invoiceRepository, never())
                .findByOrderCustomerUserId(any());
    }
}
