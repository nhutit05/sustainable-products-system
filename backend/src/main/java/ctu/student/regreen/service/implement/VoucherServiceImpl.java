package ctu.student.regreen.service.implement;

import java.util.List;

import org.springframework.stereotype.Service;

import ctu.student.regreen.dto.request.VoucherRequest;
import ctu.student.regreen.dto.response.VoucherResponse;
import ctu.student.regreen.mapper.VoucherMapper;
import ctu.student.regreen.model.Voucher;
import ctu.student.regreen.repository.VoucherRepository;
import ctu.student.regreen.service.interfaces.VoucherService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VoucherServiceImpl
        implements VoucherService {

    private final VoucherRepository repository;

    private final VoucherMapper mapper;

    @Override
    public VoucherResponse create(
            VoucherRequest request) {

        validateVoucher(request);

        if (repository.existsByCode(
                request.getCode())) {

            throw new RuntimeException(
                    "Voucher code already exists");
        }

        Voucher voucher =
                mapper.toEntity(request);

        voucher =
                repository.save(voucher);

        return mapper.toResponse(voucher);
    }

    @Override
    public List<VoucherResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public VoucherResponse getById(
            Integer id) {

        Voucher voucher =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Voucher not found with id: " + id));

        return mapper.toResponse(voucher);
    }

    @Override
    public VoucherResponse update(
            Integer id,
            VoucherRequest request) {

        validateVoucher(request);

        Voucher voucher =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Voucher not found with id: " + id));

        Voucher existedVoucher =
                repository.findByCode(
                                request.getCode())
                        .orElse(null);

        if (existedVoucher != null
                && !existedVoucher.getVoucherId()
                        .equals(id)) {

            throw new RuntimeException(
                    "Voucher code already exists");
        }

        mapper.update(
                voucher,
                request);

        voucher =
                repository.save(voucher);

        return mapper.toResponse(voucher);
    }

    @Override
    public void delete(
            Integer id) {

        Voucher voucher =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Voucher not found with id: " + id));

        repository.delete(voucher);
    }

    private void validateVoucher(
            VoucherRequest request) {

        validateDate(request);

        validateDiscount(request);

        validateQuantity(request);
    }

    private void validateDate(
            VoucherRequest request) {

        if (!request.getExpiredAt()
                .isAfter(
                        request.getStartedAt())) {

            throw new RuntimeException(
                    "Expired date must be after started date");
        }
    }

    private void validateDiscount(
            VoucherRequest request) {

        if (request.getDiscountValue() == null
                || request.getDiscountValue() <= 0) {

            throw new RuntimeException(
                    "Discount value must be greater than 0");
        }
    }

    private void validateQuantity(
            VoucherRequest request) {

        if (request.getQuantity() == null
                || request.getQuantity() <= 0) {

            throw new RuntimeException(
                    "Quantity must be greater than 0");
        }
    }
}