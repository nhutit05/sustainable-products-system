package ctu.student.regreen.service;

import ctu.student.regreen.dto.request.VoucherRequest;
import ctu.student.regreen.dto.response.VoucherResponse;
import ctu.student.regreen.mapper.VoucherMapper;
import ctu.student.regreen.model.Voucher;
import ctu.student.regreen.repository.VoucherRepository;
import ctu.student.regreen.service.implement.VoucherServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
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

    @InjectMocks
    private VoucherServiceImpl service;

    private Voucher voucher;
    private VoucherRequest request;
    private VoucherResponse response;

    @BeforeEach
    void setUp() {

        voucher = new Voucher();
        voucher.setVoucherId(1);
        voucher.setCode("SALE10");

        request = new VoucherRequest();

        request.setCode("SALE10");
        request.setDiscountValue(10F);
        request.setQuantity(100);

        request.setStartedAt(
                LocalDate.now());

        request.setExpiredAt(
                LocalDate.now().plusDays(10));

        response =
                mock(VoucherResponse.class);

        lenient()
                .when(mapper.toResponse(any()))
                .thenReturn(response);

        lenient()
                .when(mapper.toEntity(any()))
                .thenReturn(voucher);
    }

    @Test
    void create_success() {

        when(repository.existsByCode("SALE10"))
                .thenReturn(false);

        when(repository.save(any()))
                .thenReturn(voucher);

        VoucherResponse result =
                service.create(request);

        assertNotNull(result);

        verify(repository)
                .save(any());
    }

    @Test
    void create_duplicateCode_fail() {

        when(repository.existsByCode("SALE10"))
                .thenReturn(true);

        RuntimeException ex =
                assertThrows(
                        RuntimeException.class,
                        () -> service.create(request));

        assertEquals(
                "Voucher code already exists",
                ex.getMessage());
    }

    @Test
    void create_invalidDate_fail() {

        request.setExpiredAt(
                request.getStartedAt());

        RuntimeException ex =
                assertThrows(
                        RuntimeException.class,
                        () -> service.create(request));

        assertEquals(
                "Expired date must be after started date",
                ex.getMessage());
    }

    @Test
    void create_invalidDiscount_fail() {

        request.setDiscountValue(0F);

        RuntimeException ex =
                assertThrows(
                        RuntimeException.class,
                        () -> service.create(request));

        assertEquals(
                "Discount value must be greater than 0",
                ex.getMessage());
    }

    @Test
    void create_invalidQuantity_fail() {

        request.setQuantity(0);

        RuntimeException ex =
                assertThrows(
                        RuntimeException.class,
                        () -> service.create(request));

        assertEquals(
                "Quantity must be greater than 0",
                ex.getMessage());
    }

    @Test
    void getAll_success() {

        when(repository.findAll())
                .thenReturn(
                        List.of(voucher));

        List<VoucherResponse> result =
                service.getAll();

        assertEquals(
                1,
                result.size());
    }

    @Test
    void getById_success() {

        when(repository.findById(1))
                .thenReturn(
                        Optional.of(voucher));

        VoucherResponse result =
                service.getById(1);

        assertNotNull(result);
    }

    @Test
    void getById_notFound_fail() {

        when(repository.findById(1))
                .thenReturn(
                        Optional.empty());

        RuntimeException ex =
                assertThrows(
                        RuntimeException.class,
                        () -> service.getById(1));

        assertEquals(
                "Voucher not found with id: 1",
                ex.getMessage());
    }

    @Test
    void update_success() {

        when(repository.findById(1))
                .thenReturn(
                        Optional.of(voucher));

        when(repository.findByCode("SALE10"))
                .thenReturn(
                        Optional.of(voucher));

        when(repository.save(any()))
                .thenReturn(voucher);

        VoucherResponse result =
                service.update(
                        1,
                        request);

        assertNotNull(result);

        verify(mapper)
                .update(
                        voucher,
                        request);
    }

    @Test
    void update_notFound_fail() {

        when(repository.findById(1))
                .thenReturn(
                        Optional.empty());

        RuntimeException ex =
                assertThrows(
                        RuntimeException.class,
                        () -> service.update(
                                1,
                                request));

        assertEquals(
                "Voucher not found with id: 1",
                ex.getMessage());
    }

    @Test
    void update_duplicateCode_fail() {

        Voucher anotherVoucher =
                new Voucher();

        anotherVoucher.setVoucherId(99);

        when(repository.findById(1))
                .thenReturn(
                        Optional.of(voucher));

        when(repository.findByCode("SALE10"))
                .thenReturn(
                        Optional.of(
                                anotherVoucher));

        RuntimeException ex =
                assertThrows(
                        RuntimeException.class,
                        () -> service.update(
                                1,
                                request));

        assertEquals(
                "Voucher code already exists",
                ex.getMessage());
    }

    @Test
    void delete_success() {

        when(repository.findById(1))
                .thenReturn(
                        Optional.of(voucher));

        service.delete(1);

        verify(repository)
                .delete(voucher);
    }

    @Test
    void delete_notFound_fail() {

        when(repository.findById(1))
                .thenReturn(
                        Optional.empty());

        RuntimeException ex =
                assertThrows(
                        RuntimeException.class,
                        () -> service.delete(1));

        assertEquals(
                "Voucher not found with id: 1",
                ex.getMessage());
    }
}