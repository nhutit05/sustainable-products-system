package ctu.student.regreen.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class VoucherRequest {

    @NotBlank
    @Size(max = 50)
    private String code;

    @NotBlank
    private String description;

    @NotNull
    @Positive
    private Float discountValue;

    @NotNull
    @FutureOrPresent
    private LocalDate startedAt;

    @NotNull
    private LocalDate expiredAt;

    @NotNull
    @PositiveOrZero
    private Integer quantity;

    @NotNull
    private Boolean isActive;

    @PositiveOrZero
    private Float minOrderValue;

    @PositiveOrZero
    private Float maxDiscountAmount;
}
