package ctu.student.regreen.dto.response;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VoucherSummaryResponse {

    private Integer voucherId;

    private String code;

    private String description;

    private Float discountValue;

    private Integer quantity;

    private LocalDate expiredAt;

    private Boolean isActive;
}