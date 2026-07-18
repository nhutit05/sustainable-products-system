package ctu.student.regreen.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoucherStatsResponse {
    private Integer voucherId;
    private String code;
    private Float discountValue;
    private Long usageCount;
    private Double totalDiscountGiven;
    private Boolean isActive;
}
