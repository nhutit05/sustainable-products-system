package ctu.student.regreen.service;

import ctu.student.regreen.dto.request.VoucherRequest;
import ctu.student.regreen.dto.request.VoucherUpdateRequest;
import ctu.student.regreen.dto.response.VoucherResponse;
import ctu.student.regreen.dto.response.VoucherSummaryResponse;
import ctu.student.regreen.mapper.VoucherMapper;
import ctu.student.regreen.model.Voucher;
import ctu.student.regreen.repository.VoucherRepository;
import ctu.student.regreen.service.implement.VoucherServiceImpl;
import ctu.student.regreen.service.interfaces.NotificationService;

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

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VoucherServiceImplTest {

    @Mock
    private VoucherRepository repository;

    @Mock
    private VoucherMapper mapper;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private VoucherServiceImpl service;

    private Voucher voucher;
    private VoucherRequest createRequest;
    private VoucherUpdateRequest updateRequest;

    private static final Integer VOUCHER_ID = 1;
    private static final String CODE = "SALE10";

    @BeforeEach
    void setUp() {

        voucher = new Voucher();
        voucher.setVoucherId(VOUCHER_ID);
        voucher.setCode(CODE);
        voucher.setDescription("Sale 10%");
        voucher.setDiscountValue(10f);
        voucher.setStartedAt(LocalDate.now());
        voucher.setExpiredAt(LocalDate.now().plusDays(10));
        voucher.setQuantity(100);
        voucher.setIsActive(true);

        createRequest = new VoucherRequest();
        createRequest.setCode(CODE);
        createRequest.setDescription("Sale 10%");
        createRequest.setDiscountValue(10f);
        createRequest.setStartedAt(LocalDate.now());
        createRequest.setExpiredAt(LocalDate.now().plusDays(10));
        createRequest.setQuantity(100);
        createRequest.setIsActive(true);

        updateRequest = new VoucherUpdateRequest();
        updateRequest.setCode(CODE);
        updateRequest.setDescription("Sale 10%");
        updateRequest.setDiscountValue(10f);
        updateRequest.setStartedAt(LocalDate.now());
        updateRequest.setExpiredAt(LocalDate.now().plusDays(10));
        updateRequest.setQuantity(100);
        updateRequest.setIsActive(true);
    }

    private VoucherResponse voucherResponse() {

        return new VoucherResponse(
                VOUCHER_ID,
                CODE,
                "Sale 10%",
                10f,
                LocalDate.now(),
                LocalDate.now().plusDays(10),
                100,
                true,
                0f,
                0f);
    }

    // ==================== create ====================

    @Test
    void create_success() {

        when(repository.existsByCode(CODE))
                .thenReturn(false);

        when(mapper.toEntity(createRequest))
                .thenReturn(voucher);

        when(repository.save(voucher))
                .thenReturn(voucher);

        when(mapper.toResponse(voucher))
                .thenReturn(voucherResponse());

        VoucherResponse result =
                service.create(createRequest);

        assertNotNull(result);
        assertEquals(VOUCHER_ID, result.getVoucherId());
        assertEquals(CODE, result.getCode());

        verify(repository).existsByCode(CODE);
        verify(mapper).toEntity(createRequest);
        verify(repository).save(voucher);
        verify(notificationService)
                .notifyNewVoucherToAllCustomers(voucher);
        verify(mapper).toResponse(voucher);
    }

    @Test
    void create_duplicateCode_throwsException() {

        when(repository.existsByCode(CODE))
                .thenReturn(true);

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.create(createRequest));

        assertEquals(
                "Voucher code already exists",
                ex.getMessage());

        verify(repository, never()).save(any());
        verify(notificationService, never())
                .notifyNewVoucherToAllCustomers(any());
    }

    @Test
    void create_invalidDate_throwsException() {

        createRequest.setExpiredAt(LocalDate.now());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.create(createRequest));

        assertEquals(
                "Expired date must be after started date",
                ex.getMessage());

        verify(repository, never()).save(any());
    }

    @Test
    void create_invalidDiscount_throwsException() {

        createRequest.setDiscountValue(0f);

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.create(createRequest));

        assertEquals(
                "Discount value must be greater than 0",
                ex.getMessage());

        verify(repository, never()).save(any());
    }

    @Test
    void create_invalidQuantity_throwsException() {

        createRequest.setQuantity(0);

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.create(createRequest));

        assertEquals(
                "Quantity must be greater than 0",
                ex.getMessage());

        verify(repository, never()).save(any());
    }

    // ==================== getAll ====================

    @Test
    void getAll_success() {

        when(repository.findAllByIsActiveTrue())
                .thenReturn(List.of(voucher));

        when(mapper.toResponse(voucher))
                .thenReturn(voucherResponse());

        List<VoucherResponse> result =
                service.getAll();

        assertEquals(1, result.size());
        assertEquals(CODE, result.get(0).getCode());

        verify(repository).findAllByIsActiveTrue();
        verify(mapper).toResponse(voucher);
    }

    @Test
    void getAll_empty_returnsEmptyList() {

        when(repository.findAllByIsActiveTrue())
                .thenReturn(Collections.emptyList());

        List<VoucherResponse> result =
                service.getAll();

        assertTrue(result.isEmpty());
        verify(repository).findAllByIsActiveTrue();
        verify(mapper, never()).toResponse(any());
    }

    // ==================== getById ====================

    @Test
    void getById_success() {

        when(repository.findById(VOUCHER_ID))
                .thenReturn(Optional.of(voucher));

        when(mapper.toResponse(voucher))
                .thenReturn(voucherResponse());

        VoucherResponse result =
                service.getById(VOUCHER_ID);

        assertNotNull(result);
        assertEquals(VOUCHER_ID, result.getVoucherId());

        verify(repository).findById(VOUCHER_ID);
        verify(mapper).toResponse(voucher);
    }

    @Test
    void getById_notFound_throwsException() {

        when(repository.findById(VOUCHER_ID))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.getById(VOUCHER_ID));

        assertEquals(
                "Voucher not found with id: " + VOUCHER_ID,
                ex.getMessage());
    }

    // ==================== update ====================

    @Test
    void update_success() {

        when(repository.findById(VOUCHER_ID))
                .thenReturn(Optional.of(voucher));

        when(repository.save(voucher))
                .thenReturn(voucher);

        when(mapper.toResponse(voucher))
                .thenReturn(voucherResponse());

        VoucherResponse result =
                service.update(VOUCHER_ID, updateRequest);

        assertNotNull(result);
        assertEquals(VOUCHER_ID, result.getVoucherId());

        verify(repository).findById(VOUCHER_ID);
        verify(repository).save(voucher);
        verify(mapper).toResponse(voucher);
    }

    @Test
    void update_notFound_throwsException() {

        when(repository.findById(VOUCHER_ID))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.update(VOUCHER_ID, updateRequest));

        assertEquals(
                "Voucher not found with id: " + VOUCHER_ID,
                ex.getMessage());

        verify(repository, never()).save(any());
    }

    @Test
    void update_duplicateCode_throwsException() {

        Voucher anotherVoucher = new Voucher();
        anotherVoucher.setVoucherId(99);
        anotherVoucher.setCode("NEWCODE");

        updateRequest.setCode("NEWCODE");

        when(repository.findById(VOUCHER_ID))
                .thenReturn(Optional.of(voucher));

        when(repository.findByCode("NEWCODE"))
                .thenReturn(Optional.of(anotherVoucher));

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.update(VOUCHER_ID, updateRequest));

        assertEquals(
                "Voucher code already exists",
                ex.getMessage());

        verify(repository, never()).save(any());
    }

    @Test
    void update_sameCode_noDuplicateCheck() {

        when(repository.findById(VOUCHER_ID))
                .thenReturn(Optional.of(voucher));

        when(repository.save(voucher))
                .thenReturn(voucher);

        when(mapper.toResponse(voucher))
                .thenReturn(voucherResponse());

        VoucherResponse result =
                service.update(VOUCHER_ID, updateRequest);

        assertNotNull(result);

        verify(repository, never()).findByCode(any());
        verify(repository).save(voucher);
    }

    @Test
    void update_invalidDate_throwsException() {

        updateRequest.setStartedAt(LocalDate.now().plusDays(5));
        updateRequest.setExpiredAt(LocalDate.now().plusDays(5));

        when(repository.findById(VOUCHER_ID))
                .thenReturn(Optional.of(voucher));

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.update(VOUCHER_ID, updateRequest));

        assertEquals(
                "Expired date must be after started date",
                ex.getMessage());

        verify(repository, never()).save(any());
    }

    @Test
    void update_partialUpdate_discountOnly() {

        when(repository.findById(VOUCHER_ID))
                .thenReturn(Optional.of(voucher));

        VoucherUpdateRequest partialRequest =
                new VoucherUpdateRequest();
        partialRequest.setDiscountValue(20f);

        when(repository.save(voucher))
                .thenReturn(voucher);

        VoucherResponse expected = new VoucherResponse(
                VOUCHER_ID, CODE, "Sale 10%",
                20f, LocalDate.now(),
                LocalDate.now().plusDays(10),
                100, true, 0f, 0f);

        when(mapper.toResponse(voucher))
                .thenReturn(expected);

        VoucherResponse result =
                service.update(VOUCHER_ID, partialRequest);

        assertNotNull(result);
        assertEquals(20f, result.getDiscountValue());

        verify(repository).save(voucher);
    }

    // ==================== getAllForAdmin ====================

    @Test
    void getAllForAdmin_success() {

        VoucherSummaryResponse summary =
                new VoucherSummaryResponse(
                        VOUCHER_ID, CODE, "Sale 10%",
                        10f, LocalDate.now(),
                        100, LocalDate.now().plusDays(10),
                        true, 0f, 0f);

        Pageable pageable = PageRequest.of(0, 10);
        Page<Voucher> voucherPage =
                new PageImpl<>(List.of(voucher), pageable, 1);

        when(repository.findAll(
                any(Specification.class),
                any(Pageable.class)))
                .thenReturn(voucherPage);

        when(mapper.toSummary(voucher))
                .thenReturn(summary);

        Page<VoucherSummaryResponse> result =
                service.getAllForAdmin(null, null, pageable);

        assertEquals(1, result.getContent().size());
        assertEquals(CODE, result.getContent().get(0).getCode());

        verify(repository).findAll(
                any(Specification.class),
                any(Pageable.class));
        verify(mapper).toSummary(voucher);
    }

    @Test
    void getAllForAdmin_empty_returnsEmptyPage() {

        Pageable pageable = PageRequest.of(0, 10);
        Page<Voucher> emptyPage =
                new PageImpl<>(Collections.emptyList(), pageable, 0);

        when(repository.findAll(
                any(Specification.class),
                any(Pageable.class)))
                .thenReturn(emptyPage);

        Page<VoucherSummaryResponse> result =
                service.getAllForAdmin(null, null, pageable);

        assertTrue(result.getContent().isEmpty());
        verify(mapper, never()).toSummary(any());
    }

    // ==================== delete ====================

    @Test
    void delete_success() {

        when(repository.findById(VOUCHER_ID))
                .thenReturn(Optional.of(voucher));

        service.delete(VOUCHER_ID);

        verify(repository).findById(VOUCHER_ID);
        verify((org.springframework.data.repository.CrudRepository) repository).delete(voucher);
    }

    @Test
    void delete_notFound_throwsException() {

        when(repository.findById(VOUCHER_ID))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.delete(VOUCHER_ID));

        assertEquals(
                "Voucher not found with id: " + VOUCHER_ID,
                ex.getMessage());

        verify((org.springframework.data.repository.CrudRepository<?, ?>) repository, never()).delete(any());
    }
}
