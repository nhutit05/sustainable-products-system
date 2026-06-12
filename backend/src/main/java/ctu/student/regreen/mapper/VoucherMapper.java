package ctu.student.regreen.mapper;

import org.springframework.stereotype.Component;

import ctu.student.regreen.dto.request.VoucherRequest;
import ctu.student.regreen.dto.response.VoucherResponse;
import ctu.student.regreen.model.Voucher;

@Component
public class VoucherMapper {

    public Voucher toEntity(VoucherRequest request) {

        Voucher voucher = new Voucher();

        voucher.setCode(request.getCode());
        voucher.setDescription(request.getDescription());
        voucher.setDiscountValue(request.getDiscountValue());
        voucher.setStartedAt(request.getStartedAt());
        voucher.setExpiredAt(request.getExpiredAt());
        voucher.setQuantity(request.getQuantity());
        voucher.setIsActive(request.getIsActive());

        return voucher;
    }

    public VoucherResponse toResponse(Voucher voucher) {

        return new VoucherResponse(
                voucher.getVoucherId(),
                voucher.getCode(),
                voucher.getDescription(),
                voucher.getDiscountValue(),
                voucher.getStartedAt(),
                voucher.getExpiredAt(),
                voucher.getQuantity(),
                voucher.getIsActive());
    }

    public void update(Voucher voucher, VoucherRequest request) {

        voucher.setDescription(request.getDescription());
        voucher.setDiscountValue(request.getDiscountValue());
        voucher.setStartedAt(request.getStartedAt());
        voucher.setExpiredAt(request.getExpiredAt());
        voucher.setQuantity(request.getQuantity());
        voucher.setIsActive(request.getIsActive());
    }
}