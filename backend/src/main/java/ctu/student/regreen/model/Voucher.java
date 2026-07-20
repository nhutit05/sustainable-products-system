package ctu.student.regreen.model;

import java.time.LocalDate;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
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

    @Column(name = "voucher_id")
    private Integer voucherId;

    @Column(nullable = false, updatable = false, unique = true, length = 50, name = "code")
    private String code;

    @Column(nullable = false, columnDefinition = "TEXT", name = "description")
    private String description;

    @Column(nullable = false, name = "discount_value")
    private Float discountValue;

    @Column(nullable = false, name = "started_at")
    private LocalDate startedAt;

    @NotNull
    @Column(nullable = false, name = "expired_at")
    private LocalDate expiredAt;

    @Column(nullable = false, updatable = true, name = "quantity")
    private Integer quantity;

    @Column(nullable = false, name = "is_active")
    private Boolean isActive = true;

    @Column(name = "min_order_value")
    private Float minOrderValue = 0f;

    @Column(name = "max_discount_amount")
    private Float maxDiscountAmount = 0f;

    @AssertTrue(message = "Expired date must be after or equal started date")
    public boolean isDateValid() {
        if (startedAt == null || expiredAt == null) {
            return true;
        }
        return !expiredAt.isBefore(startedAt);
    }
}
