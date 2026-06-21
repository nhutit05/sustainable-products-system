package ctu.student.regreen.service;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import ctu.student.regreen.dto.response.RefundSlipResponse;
import ctu.student.regreen.mapper.RefundSlipMapper;
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

    @InjectMocks
    private AdminRefundSlipServiceImpl service;

    private RefundSlip refundSlip;
    private RefundSlipResponse response;

    @BeforeEach
    void setUp() {

        refundSlip = new RefundSlip();

        response = mock(RefundSlipResponse.class);

        lenient()
                .when(refundSlipMapper.toResponse(any()))
                .thenReturn(response);
    }

    private RefundStatus refundStatus(
            String name) {

        RefundStatus status =
                new RefundStatus();

        status.setRefundStatusName(name);

        return status;
    }

    @Test
    void getAllRefundSlips_success() {

        when(refundSlipRepository.findAll())
                .thenReturn(
                        List.of(refundSlip));

        List<RefundSlipResponse> result =
                service.getAllRefundSlips();

        assertEquals(
                1,
                result.size());

        verify(refundSlipRepository)
                .findAll();
    }

    @Test
    void getRefundSlipById_success() {

        when(refundSlipRepository.findById(1))
                .thenReturn(
                        Optional.of(refundSlip));

        RefundSlipResponse result =
                service.getRefundSlipById(1);

        assertNotNull(result);
    }

    @Test
    void getRefundSlipById_notFound_fail() {

        when(refundSlipRepository.findById(1))
                .thenReturn(Optional.empty());

        RuntimeException ex =
                assertThrows(
                        RuntimeException.class,
                        () -> service.getRefundSlipById(1));

        assertEquals(
                "Refund slip not found",
                ex.getMessage());
    }

    @Test
    void approveRefund_success() {

        refundSlip.setRefundStatus(
                refundStatus("PENDING"));

        when(refundSlipRepository.findById(1))
                .thenReturn(
                        Optional.of(refundSlip));

        when(refundStatusRepository
                .findByRefundStatusName("APPROVED"))
                .thenReturn(
                        Optional.of(
                                refundStatus("APPROVED")));

        when(refundSlipRepository.save(any()))
                .thenReturn(refundSlip);

        service.approveRefund(1);

        assertEquals(
                "APPROVED",
                refundSlip.getRefundStatus()
                        .getRefundStatusName());
    }

    @Test
    void rejectRefund_success() {

        refundSlip.setRefundStatus(
                refundStatus("PENDING"));

        when(refundSlipRepository.findById(1))
                .thenReturn(
                        Optional.of(refundSlip));

        when(refundStatusRepository
                .findByRefundStatusName("REJECTED"))
                .thenReturn(
                        Optional.of(
                                refundStatus("REJECTED")));

        when(refundSlipRepository.save(any()))
                .thenReturn(refundSlip);

        service.rejectRefund(1);

        assertEquals(
                "REJECTED",
                refundSlip.getRefundStatus()
                        .getRefundStatusName());
    }

    @Test
    void markRefunded_success() {

        refundSlip.setRefundStatus(
                refundStatus("APPROVED"));

        when(refundSlipRepository.findById(1))
                .thenReturn(
                        Optional.of(refundSlip));

        when(refundStatusRepository
                .findByRefundStatusName("REFUNDED"))
                .thenReturn(
                        Optional.of(
                                refundStatus("REFUNDED")));

        when(refundSlipRepository.save(any()))
                .thenReturn(refundSlip);

        service.markRefunded(1);

        assertEquals(
                "REFUNDED",
                refundSlip.getRefundStatus()
                        .getRefundStatusName());
    }

    @Test
    void approveRefund_invalidTransition_fail() {

        refundSlip.setRefundStatus(
                refundStatus("REFUNDED"));

        when(refundSlipRepository.findById(1))
                .thenReturn(
                        Optional.of(refundSlip));

        RuntimeException ex =
                assertThrows(
                        RuntimeException.class,
                        () -> service.approveRefund(1));

        assertEquals(
                "Invalid refund status transition",
                ex.getMessage());

        verify(refundSlipRepository,
                never()).save(any());
    }

    @Test
    void markRefunded_invalidTransition_fail() {

        refundSlip.setRefundStatus(
                refundStatus("PENDING"));

        when(refundSlipRepository.findById(1))
                .thenReturn(
                        Optional.of(refundSlip));

        RuntimeException ex =
                assertThrows(
                        RuntimeException.class,
                        () -> service.markRefunded(1));

        assertEquals(
                "Invalid refund status transition",
                ex.getMessage());

        verify(refundSlipRepository,
                never()).save(any());
    }

    @Test
    void approveRefund_statusNotFound_fail() {

        refundSlip.setRefundStatus(
                refundStatus("PENDING"));

        when(refundSlipRepository.findById(1))
                .thenReturn(
                        Optional.of(refundSlip));

        when(refundStatusRepository
                .findByRefundStatusName("APPROVED"))
                .thenReturn(Optional.empty());

        RuntimeException ex =
                assertThrows(
                        RuntimeException.class,
                        () -> service.approveRefund(1));

        assertEquals(
                "Refund status not found",
                ex.getMessage());
    }
}


