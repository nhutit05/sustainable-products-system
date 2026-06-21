package ctu.student.regreen.service;

import ctu.student.regreen.dto.response.InvoiceResponse;
import ctu.student.regreen.mapper.InvoiceMapper;
import ctu.student.regreen.model.Customer;
import ctu.student.regreen.model.Invoice;
import ctu.student.regreen.model.Order;
import ctu.student.regreen.repository.CustomerRepository;
import ctu.student.regreen.repository.InvoiceRepository;
import ctu.student.regreen.service.implement.InvoiceServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

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

    @BeforeEach
    void setUp() {

        Authentication authentication =
                mock(Authentication.class);

        SecurityContext securityContext =
                mock(SecurityContext.class);

        when(authentication.getName())
                .thenReturn("testuser");

        when(securityContext.getAuthentication())
                .thenReturn(authentication);

        SecurityContextHolder.setContext(
                securityContext);

        customer = new Customer();
        customer.setUserId(1);

        order = new Order();
        order.setOrderId(1);
        order.setCustomer(customer);

        invoice = new Invoice();
        invoice.setOrder(order);

        response = mock(InvoiceResponse.class);

        when(customerRepository
                .findByUsername("testuser"))
                .thenReturn(Optional.of(customer));

        lenient()
                .when(invoiceMapper.toResponse(any()))
                .thenReturn(response);
    }

    @Test
    void getById_success() {

        when(invoiceRepository.findById(1))
                .thenReturn(Optional.of(invoice));

        InvoiceResponse result =
                service.getById(1);

        assertNotNull(result);

        verify(invoiceRepository)
                .findById(1);
    }

    @Test
    void getById_invoiceNotFound_fail() {

        when(invoiceRepository.findById(1))
                .thenReturn(Optional.empty());

        RuntimeException ex =
                assertThrows(
                        RuntimeException.class,
                        () -> service.getById(1));

        assertEquals(
                "Invoice not found",
                ex.getMessage());
    }

    @Test
    void getById_accessDenied_fail() {

        Customer anotherCustomer =
                new Customer();

        anotherCustomer.setUserId(99);

        order.setCustomer(
                anotherCustomer);

        when(invoiceRepository.findById(1))
                .thenReturn(Optional.of(invoice));

        RuntimeException ex =
                assertThrows(
                        RuntimeException.class,
                        () -> service.getById(1));

        assertEquals(
                "Access denied",
                ex.getMessage());
    }

    @Test
    void getByOrder_success() {

        when(invoiceRepository
                .findByOrderOrderId(1))
                .thenReturn(Optional.of(invoice));

        InvoiceResponse result =
                service.getByOrder(1);

        assertNotNull(result);
    }

    @Test
    void getByOrder_invoiceNotFound_fail() {

        when(invoiceRepository
                .findByOrderOrderId(1))
                .thenReturn(Optional.empty());

        RuntimeException ex =
                assertThrows(
                        RuntimeException.class,
                        () -> service.getByOrder(1));

        assertEquals(
                "Invoice not found",
                ex.getMessage());
    }

    @Test
    void getByOrder_accessDenied_fail() {

        Customer anotherCustomer =
                new Customer();

        anotherCustomer.setUserId(99);

        order.setCustomer(
                anotherCustomer);

        when(invoiceRepository
                .findByOrderOrderId(1))
                .thenReturn(Optional.of(invoice));

        RuntimeException ex =
                assertThrows(
                        RuntimeException.class,
                        () -> service.getByOrder(1));

        assertEquals(
                "Access denied",
                ex.getMessage());
    }

    @Test
    void getMyInvoices_success() {

        when(invoiceRepository
                .findByOrderCustomerUserId(1))
                .thenReturn(List.of(invoice));

        List<InvoiceResponse> result =
                service.getMyInvoices();

        assertEquals(
                1,
                result.size());

        verify(invoiceRepository)
                .findByOrderCustomerUserId(1);
    }
}

