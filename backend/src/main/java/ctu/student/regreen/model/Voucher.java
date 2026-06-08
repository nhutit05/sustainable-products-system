package ctu.student.regreen.model;

import java.time.LocalDate;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "vouchers")
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer voucher_id;

    @Column(nullable = false, updatable = false, unique = true, length = 50)
    @NotBlank
    @Size(max = 50)
    private String code;

    @Column(nullable = false, columnDefinition = "TEXT")
    @NotBlank
    private String description;

    @PositiveOrZero
    @NotNull
    @Column(nullable = false)
    private Float discount_value;

    @NotNull
    @Column(nullable = false)
    @FutureOrPresent
    private LocalDate started_at;

    @NotNull
    @Column(nullable = false)
    private LocalDate expired_at;

    @Column(nullable = false, updatable = true)
    @PositiveOrZero
    @NotNull
    private Integer quantity;

    @Column(nullable = false)
    @NotNull
    private Boolean is_active = true;

    @AssertTrue(message = "Expired date must be after or equal started date")
    public boolean isDateValid() {
        if (started_at == null || expired_at == null) {
            return true;
        }
        return !expired_at.isBefore(started_at);
    }
}
