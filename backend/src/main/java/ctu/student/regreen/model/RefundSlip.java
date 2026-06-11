package ctu.student.regreen.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "refund_slips")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString(exclude = {"order", "bank"})
public class RefundSlip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "refund_slip_id")
    private Integer refundSlipId;

    @NotBlank(message = "So tai khoản ngân hàng không được để trống")
    @Pattern(regexp = "^[0-9]{6,20}$")
    @Column(nullable = false, name = "bank_number")
    private String bankNumber;

    @NotBlank(message = "Tên chủ tài khoản ngân hàng không được để trống")
    @Column(nullable = false, name = "account_bank_name")
    private String accountBankName;

    @NotBlank(message = "Vui lòng nhập lý do hoàn tiền")
    @Column(nullable = false, name = "reason")
    private String reason;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "bank_id", nullable = false)
    private Bank bank;
}
