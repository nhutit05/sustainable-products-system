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

import java.time.LocalDateTime;
import java.util.Collections;
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

    private static final Integer INVOICE_ID = 1;
    private static final LocalDateTime CREATED_AT =
            LocalDateTime.of(2025, 1, 15, 10, 30);
    private static final String RECEIVER = "Nguyen Van A";
    private static final String PHONE = "0901234567";
    private static final Float TOTAL_AMOUNT = 200_000f;
    private static final Float DISCOUNT_AMOUNT = 20_000f;
    private static final Float FINAL_AMOUNT = 180_000f;

    @BeforeEach
    void setUp() {

        invoice = new Invoice();
        invoice.setInvoiceId(INVOICE_ID);
        invoice.setCreatedAt(CREATED_AT);

        response = new InvoiceResponse(
                INVOICE_ID,
                CREATED_AT,
                1,
                RECEIVER,
                PHONE,
                TOTAL_AMOUNT,
                DISCOUNT_AMOUNT,
                FINAL_AMOUNT);
    }

    @Test
    void getAllInvoices_success() {

        when(invoiceRepository.findAll())
                .thenReturn(List.of(invoice));
        when(invoiceMapper.toResponse(any(Invoice.class)))
                .thenReturn(response);

        List<InvoiceResponse> result =
                service.getAllInvoices();

        assertEquals(1, result.size());
        assertEquals(INVOICE_ID, result.get(0).getInvoiceId());
        assertEquals(RECEIVER, result.get(0).getOrderReceiver());
        assertEquals(PHONE, result.get(0).getOrderReceiverPhone());
        assertEquals(TOTAL_AMOUNT, result.get(0).getTotalAmount());
        assertEquals(DISCOUNT_AMOUNT, result.get(0).getDiscountAmount());
        assertEquals(FINAL_AMOUNT, result.get(0).getFinalAmount());

        verify(invoiceRepository).findAll();
        verify(invoiceMapper).toResponse(invoice);
    }

    @Test
    void getAllInvoices_emptyList_returnsEmpty() {

        when(invoiceRepository.findAll())
                .thenReturn(Collections.emptyList());

        List<InvoiceResponse> result =
                service.getAllInvoices();

        assertTrue(result.isEmpty());
        verify(invoiceRepository).findAll();
        verify(invoiceMapper, never()).toResponse(any());
    }

    @Test
    void getInvoiceById_success() {

        when(invoiceRepository.findById(INVOICE_ID))
                .thenReturn(Optional.of(invoice));
        when(invoiceMapper.toResponse(invoice))
                .thenReturn(response);

        InvoiceResponse result =
                service.getInvoiceById(INVOICE_ID);

        assertNotNull(result);
        assertEquals(INVOICE_ID, result.getInvoiceId());
        assertEquals(CREATED_AT, result.getCreatedAt());
        assertEquals(RECEIVER, result.getOrderReceiver());

        verify(invoiceRepository).findById(INVOICE_ID);
        verify(invoiceMapper).toResponse(invoice);
    }

    @Test
    void getInvoiceById_notFound_throwsException() {

        when(invoiceRepository.findById(INVOICE_ID))
                .thenReturn(Optional.empty());

        RuntimeException ex =
                assertThrows(
                        RuntimeException.class,
                        () -> service.getInvoiceById(INVOICE_ID));

        assertEquals("Invoice not found", ex.getMessage());
        verify(invoiceRepository).findById(INVOICE_ID);
        verify(invoiceMapper, never()).toResponse(any());
    }
}
