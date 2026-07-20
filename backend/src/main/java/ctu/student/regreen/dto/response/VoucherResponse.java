package ctu.student.regreen.dto.response;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VoucherResponse {

    private Integer voucherId;

    private String code;

    private String description;

    private Float discountValue;

    private LocalDate startedAt;

    private LocalDate expiredAt;

    private Integer quantity;

    private Boolean isActive;

    private Float minOrderValue;

    private Float maxDiscountAmount;
}