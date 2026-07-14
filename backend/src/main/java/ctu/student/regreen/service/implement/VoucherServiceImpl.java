package ctu.student.regreen.service.implement;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ctu.student.regreen.dto.request.VoucherRequest;
import ctu.student.regreen.dto.request.VoucherUpdateRequest;
import ctu.student.regreen.dto.response.VoucherResponse;
import ctu.student.regreen.dto.response.VoucherSummaryResponse;
import ctu.student.regreen.mapper.VoucherMapper;
import ctu.student.regreen.model.Voucher;
import ctu.student.regreen.repository.VoucherRepository;
import ctu.student.regreen.service.interfaces.VoucherService;
import ctu.student.regreen.specification.VoucherSpecification;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VoucherServiceImpl
                implements VoucherService {

        private final VoucherRepository repository;

        private final VoucherMapper mapper;

        @Override
        @Transactional
        public VoucherResponse create(
                        VoucherRequest request) {

                validateVoucher(request);

                if (repository.existsByCode(
                                request.getCode())) {

                        throw new RuntimeException(
                                        "Voucher code already exists");
                }

                Voucher voucher = mapper.toEntity(request);

                voucher = repository.save(voucher);

                return mapper.toResponse(voucher);
        }

        @Override
        public List<VoucherResponse> getAll() {

                return repository.findAllByIsActiveTrue()
                                .stream()
                                .map(mapper::toResponse)
                                .toList();
        }

        @Override
        public VoucherResponse getById(
                        Integer id) {

                Voucher voucher = repository.findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                                "Voucher not found with id: " + id));

                return mapper.toResponse(voucher);
        }

        @Override
        @Transactional
        public VoucherResponse update(
                        Integer id,
                        VoucherUpdateRequest request) {

                Voucher voucher = repository.findById(id)
                                .orElseThrow(() -> new RuntimeException(
                                                "Voucher not found with id: " + id));

                // Code
                if (request.getCode() != null &&
                                !request.getCode().equals(voucher.getCode())) {

                        Voucher existedVoucher = repository.findByCode(request.getCode())
                                        .orElse(null);

                        if (existedVoucher != null &&
                                        !existedVoucher.getVoucherId().equals(id)) {

                                throw new RuntimeException(
                                                "Voucher code already exists");
                        }

                        voucher.setCode(request.getCode());
                }

                // Description
                if (request.getDescription() != null) {
                        voucher.setDescription(request.getDescription());
                }

                // Discount
                if (request.getDiscountValue() != null) {
                        voucher.setDiscountValue(request.getDiscountValue());
                }

                // Quantity
                if (request.getQuantity() != null) {
                        voucher.setQuantity(request.getQuantity());
                }

                // Active
                if (request.getIsActive() != null) {
                        voucher.setIsActive(request.getIsActive());
                }

                // Validate và cập nhật ngày
                LocalDate startedAt = request.getStartedAt() != null
                                ? request.getStartedAt()
                                : voucher.getStartedAt();

                LocalDate expiredAt = request.getExpiredAt() != null
                                ? request.getExpiredAt()
                                : voucher.getExpiredAt();

                if (!expiredAt.isAfter(startedAt)) {
                        throw new RuntimeException(
                                        "Expired date must be after started date");
                }

                voucher.setStartedAt(startedAt);
                voucher.setExpiredAt(expiredAt);

                voucher = repository.save(voucher);

                return mapper.toResponse(voucher);
        }

        @Override
        public Page<VoucherSummaryResponse> getAllForAdmin(
                        String keyword,
                        Boolean active,
                        Pageable pageable) {

                return repository.findAll(
                                VoucherSpecification.filter(
                                                keyword,
                                                active),
                                pageable)
                                .map(mapper::toSummary);
        }

        @Override
        @Transactional
        public void delete(
                        Integer id) {

                Voucher voucher = repository.findById(id)
                                .orElseThrow(() -> new RuntimeException(
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