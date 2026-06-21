package ctu.student.regreen.service;

import ctu.student.regreen.dto.response.InvoiceResponse;
import ctu.student.regreen.mapper.InvoiceMapper;
import ctu.student.regreen.model.Invoice;
import ctu.student.regreen.repository.InvoiceRepository;
import ctu.student.regreen.service.implement.AdminInvoiceServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminInvoiceServiceImplTest {

    @Mock
    private InvoiceRepository invoiceRepository;

    @Mock
    private InvoiceMapper invoiceMapper;

    @InjectMocks
    private AdminInvoiceServiceImpl service;

    private Invoice invoice;
    private InvoiceResponse response;

    @BeforeEach
    void setUp() {

        invoice = new Invoice();

        response = mock(
                InvoiceResponse.class);

        lenient()
                .when(invoiceMapper.toResponse(any()))
                .thenReturn(response);
    }

    @Test
    void getAllInvoices_success() {

        when(invoiceRepository.findAll())
                .thenReturn(
                        List.of(invoice));

        List<InvoiceResponse> result =
                service.getAllInvoices();

        assertEquals(
                1,
                result.size());

        verify(invoiceRepository)
                .findAll();
    }

    @Test
    void getInvoiceById_success() {

        when(invoiceRepository.findById(1))
                .thenReturn(
                        Optional.of(invoice));

        InvoiceResponse result =
                service.getInvoiceById(1);

        assertNotNull(result);

        verify(invoiceRepository)
                .findById(1);
    }

    @Test
    void getInvoiceById_notFound_fail() {

        when(invoiceRepository.findById(1))
                .thenReturn(
                        Optional.empty());

        RuntimeException ex =
                assertThrows(
                        RuntimeException.class,
                        () -> service.getInvoiceById(1));

        assertEquals(
                "Invoice not found",
                ex.getMessage());
    }
}