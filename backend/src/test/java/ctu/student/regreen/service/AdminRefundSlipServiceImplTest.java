package ctu.student.regreen.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
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

import ctu.student.regreen.dto.response.RefundSlipResponse;
import ctu.student.regreen.integration.payos.service.PayOSPayoutService;
import ctu.student.regreen.mapper.RefundSlipMapper;
import ctu.student.regreen.model.Bank;
import ctu.student.regreen.model.Order;
import ctu.student.regreen.model.OrderItem;
import ctu.student.regreen.model.RefundSlip;
import ctu.student.regreen.model.RefundStatus;
import ctu.student.regreen.repository.RefundSlipRepository;
import ctu.student.regreen.repository.RefundStatusRepository;
import ctu.student.regreen.service.implement.AdminRefundSlipServiceImpl;

@ExtendWith(MockitoExtension.class)
class AdminRefundSlipServiceImplTest {

    @Mock
    private RefundSlipRepository refundSlipRepository;

    @Mock
    private RefundStatusRepository refundStatusRepository;

    @Mock
    private RefundSlipMapper refundSlipMapper;

    @Mock
    private PayOSPayoutService payOSPayoutService;

    @InjectMocks
    private AdminRefundSlipServiceImpl service;

    private RefundSlip refundSlip;
    private RefundSlipResponse response;

    private static final Integer REFUND_SLIP_ID = 1;
    private static final String BANK_NUMBER = "1234567890";
    private static final String ACCOUNT_BANK_NAME = "Nguyen Van A";
    private static final String REASON = "Product damaged";

    @BeforeEach
    void setUp() {

        Bank bank = new Bank();
        bank.setBankId("970422");
        bank.setBankName("Vietcombank");

        Order order = new Order();
        order.setOrderId(1);

        refundSlip = new RefundSlip();
        refundSlip.setRefundSlipId(REFUND_SLIP_ID);
        refundSlip.setBankNumber(BANK_NUMBER);
        refundSlip.setAccountBankName(ACCOUNT_BANK_NAME);
        refundSlip.setReason(REASON);
        refundSlip.setBank(bank);
        refundSlip.setOrder(order);

        response = new RefundSlipResponse(
                REFUND_SLIP_ID,
                BANK_NUMBER,
                ACCOUNT_BANK_NAME,
                REASON,
                1,
                "970422",
                "Vietcombank",
                1,
                "APPROVED",
                LocalDateTime.now(),
                LocalDateTime.now());
    }

    private RefundStatus refundStatus(String name) {

        RefundStatus s = new RefundStatus();
        s.setRefundStatusName(name);

        return s;
    }

    private void mockGetRefundSlipEntity() {

        when(refundSlipRepository.findByIdWithDetails(REFUND_SLIP_ID))
                .thenReturn(Optional.of(refundSlip));
    }

    private void mockUpdateStatus(
            String currentStatusName,
            String newStatusName) {

        refundSlip.setRefundStatus(refundStatus(currentStatusName));

        mockGetRefundSlipEntity();

        when(refundStatusRepository
                .findByRefundStatusName(newStatusName))
                .thenReturn(Optional.of(refundStatus(newStatusName)));

        when(refundSlipRepository.save(any(RefundSlip.class)))
                .thenReturn(refundSlip);

        when(refundSlipMapper.toResponse(any(RefundSlip.class)))
                .thenReturn(response);
    }

    // ==================== getRefundSlips ====================

    @Test
    void getRefundSlips_success() {

        RefundSlipResponse summary = new RefundSlipResponse(
                REFUND_SLIP_ID,
                null, null, null,
                null, null, null,
                null, "APPROVED",
                null, null);

        Pageable pageable = PageRequest.of(0, 10);
        Page<RefundSlip> refundPage =
                new PageImpl<>(List.of(refundSlip), pageable, 1);

        when(refundSlipRepository.findAll(
                any(Specification.class),
                any(Pageable.class)))
                .thenReturn(refundPage);

        when(refundSlipMapper.toResponse(refundSlip))
                .thenReturn(summary);

        Page<RefundSlipResponse> result =
                service.getRefundSlips(null, null, pageable);

        assertEquals(1, result.getContent().size());
        assertEquals(REFUND_SLIP_ID,
                result.getContent().get(0).getRefundSlipId());

        verify(refundSlipRepository).findAll(
                any(Specification.class),
                any(Pageable.class));
        verify(refundSlipMapper).toResponse(refundSlip);
    }

    @Test
    void getRefundSlips_empty_returnsEmptyPage() {

        Pageable pageable = PageRequest.of(0, 10);
        Page<RefundSlip> emptyPage =
                new PageImpl<>(Collections.emptyList(), pageable, 0);

        when(refundSlipRepository.findAll(
                any(Specification.class),
                any(Pageable.class)))
                .thenReturn(emptyPage);

        Page<RefundSlipResponse> result =
                service.getRefundSlips(null, null, pageable);

        assertTrue(result.getContent().isEmpty());
        verify(refundSlipMapper, never()).toResponse(any());
    }

    // ==================== getRefundSlipById ====================

    @Test
    void getRefundSlipById_success() {

        mockGetRefundSlipEntity();
        when(refundSlipMapper.toResponse(refundSlip))
                .thenReturn(response);

        RefundSlipResponse result =
                service.getRefundSlipById(REFUND_SLIP_ID);

        assertNotNull(result);
        assertEquals(REFUND_SLIP_ID, result.getRefundSlipId());

        verify(refundSlipRepository).findByIdWithDetails(REFUND_SLIP_ID);
        verify(refundSlipMapper).toResponse(refundSlip);
    }

    @Test
    void getRefundSlipById_notFound_throwsException() {

        when(refundSlipRepository.findByIdWithDetails(REFUND_SLIP_ID))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.getRefundSlipById(REFUND_SLIP_ID));

        assertEquals("Refund slip not found", ex.getMessage());
    }

    // ==================== approveRefund ====================

    @Test
    void approveRefund_success() {

        mockUpdateStatus("PENDING", "APPROVED");

        RefundSlipResponse result =
                service.approveRefund(REFUND_SLIP_ID);

        assertNotNull(result);
        assertEquals("APPROVED",
                refundSlip.getRefundStatus().getRefundStatusName());

        verify(refundSlipRepository).save(refundSlip);
        verify(refundSlipMapper).toResponse(refundSlip);
    }

    @Test
    void approveRefund_notFound_throwsException() {

        when(refundSlipRepository.findByIdWithDetails(REFUND_SLIP_ID))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.approveRefund(REFUND_SLIP_ID));

        assertEquals("Refund slip not found", ex.getMessage());
        verify(refundSlipRepository, never()).save(any());
    }

    // ==================== rejectRefund ====================

    @Test
    void rejectRefund_success() {

        mockUpdateStatus("PENDING", "REJECTED");

        RefundSlipResponse result =
                service.rejectRefund(REFUND_SLIP_ID);

        assertNotNull(result);
        assertEquals("REJECTED",
                refundSlip.getRefundStatus().getRefundStatusName());

        verify(refundSlipRepository).save(refundSlip);
        verify(refundSlipMapper).toResponse(refundSlip);
    }

    @Test
    void rejectRefund_notFound_throwsException() {

        when(refundSlipRepository.findByIdWithDetails(REFUND_SLIP_ID))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.rejectRefund(REFUND_SLIP_ID));

        assertEquals("Refund slip not found", ex.getMessage());
        verify(refundSlipRepository, never()).save(any());
    }

    // ==================== markRefunded ====================

    @Test
    void markRefunded_success() {

        mockUpdateStatus("APPROVED", "REFUNDED");

        RefundSlipResponse result =
                service.markRefunded(REFUND_SLIP_ID);

        assertNotNull(result);
        assertEquals("REFUNDED",
                refundSlip.getRefundStatus().getRefundStatusName());

        verify(refundSlipRepository).save(refundSlip);
        verify(refundSlipMapper).toResponse(refundSlip);
    }

    @Test
    void markRefunded_notFound_throwsException() {

        when(refundSlipRepository.findByIdWithDetails(REFUND_SLIP_ID))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.markRefunded(REFUND_SLIP_ID));

        assertEquals("Refund slip not found", ex.getMessage());
        verify(refundSlipRepository, never()).save(any());
    }

    // ==================== invalid transitions ====================

    @Test
    void approveRefund_fromApproved_throwsException() {

        refundSlip.setRefundStatus(refundStatus("APPROVED"));
        mockGetRefundSlipEntity();

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.approveRefund(REFUND_SLIP_ID));

        assertEquals(
                "Invalid refund status transition",
                ex.getMessage());

        verify(refundSlipRepository, never()).save(any());
    }

    @Test
    void approveRefund_fromRefunded_throwsException() {

        refundSlip.setRefundStatus(refundStatus("REFUNDED"));
        mockGetRefundSlipEntity();

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.approveRefund(REFUND_SLIP_ID));

        assertEquals(
                "Invalid refund status transition",
                ex.getMessage());

        verify(refundSlipRepository, never()).save(any());
    }

    @Test
    void rejectRefund_fromApproved_throwsException() {

        refundSlip.setRefundStatus(refundStatus("APPROVED"));
        mockGetRefundSlipEntity();

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.rejectRefund(REFUND_SLIP_ID));

        assertEquals(
                "Invalid refund status transition",
                ex.getMessage());

        verify(refundSlipRepository, never()).save(any());
    }

    @Test
    void markRefunded_fromPending_throwsException() {

        refundSlip.setRefundStatus(refundStatus("PENDING"));
        mockGetRefundSlipEntity();

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.markRefunded(REFUND_SLIP_ID));

        assertEquals(
                "Invalid refund status transition",
                ex.getMessage());

        verify(refundSlipRepository, never()).save(any());
    }

    @Test
    void markRefunded_fromRejected_throwsException() {

        refundSlip.setRefundStatus(refundStatus("REJECTED"));
        mockGetRefundSlipEntity();

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.markRefunded(REFUND_SLIP_ID));

        assertEquals(
                "Invalid refund status transition",
                ex.getMessage());

        verify(refundSlipRepository, never()).save(any());
    }

    // ==================== status not found ====================

    @Test
    void approveRefund_statusNotFound_throwsException() {

        refundSlip.setRefundStatus(refundStatus("PENDING"));
        mockGetRefundSlipEntity();

        when(refundStatusRepository
                .findByRefundStatusName("APPROVED"))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.approveRefund(REFUND_SLIP_ID));

        assertEquals("Refund status not found", ex.getMessage());
    }

    // ==================== transferRefund ====================

    @Test
    void transferRefund_success() {

        OrderItem item = new OrderItem();
        item.setPurchasedPrice(100_000f);
        item.setQuantity(2);
        refundSlip.getOrder().setOrderItems(List.of(item));

        refundSlip.setRefundStatus(refundStatus("APPROVED"));
        mockGetRefundSlipEntity();

        when(refundStatusRepository
                .findByRefundStatusName("REFUNDED"))
                .thenReturn(Optional.of(refundStatus("REFUNDED")));

        when(refundSlipRepository.save(any(RefundSlip.class)))
                .thenReturn(refundSlip);

        when(refundSlipMapper.toResponse(any(RefundSlip.class)))
                .thenReturn(response);

        RefundSlipResponse result =
                service.transferRefund(REFUND_SLIP_ID);

        assertNotNull(result);

        verify(payOSPayoutService).transfer(
                eq(REFUND_SLIP_ID),
                eq("970422"),
                eq(BANK_NUMBER),
                eq(200_000L),
                eq("Refund order #1"));

        verify(refundSlipRepository).save(refundSlip);
        verify(refundSlipMapper).toResponse(refundSlip);
    }

    @Test
    void transferRefund_notFound_throwsException() {

        when(refundSlipRepository.findByIdWithDetails(REFUND_SLIP_ID))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.transferRefund(REFUND_SLIP_ID));

        assertEquals("Refund slip not found", ex.getMessage());
        verify(payOSPayoutService, never()).transfer(
                any(), any(), any(), any(), any());
    }

    @Test
    void transferRefund_fromPending_throwsException() {

        refundSlip.setRefundStatus(refundStatus("PENDING"));
        mockGetRefundSlipEntity();

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.transferRefund(REFUND_SLIP_ID));

        assertEquals(
                "Invalid refund status transition",
                ex.getMessage());

        verify(payOSPayoutService, never()).transfer(
                any(), any(), any(), any(), any());
    }
}
