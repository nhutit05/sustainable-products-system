package ctu.student.regreen.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class VoucherUpdateRequest {

    @Size(max = 50)
    private String code;

    private String description;

    @Positive
    private Float discountValue;

    @FutureOrPresent
    private LocalDate startedAt;

    private LocalDate expiredAt;

    @PositiveOrZero
    private Integer quantity;

    private Boolean isActive;
}