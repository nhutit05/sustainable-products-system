package ctu.student.regreen.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "refund_slips")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RefundSlip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "refund_slip_id", nullable = false, updatable = false)
    private Integer refundSlipId;

    @NotBlank(message = "Số tài khoản ngân hàng không được để trống")
    @Column(name = "bank_number", nullable = false)
    private String bankNumber;
    
    @NotBlank(message = "Tên chủ tài khoản ngân hàng không được để trống")
    @Column(name = "account_bank_name", nullable = false)
    private String accountBankName;

    @NotBlank(message = "Vui lòng nhập lý do hoàn tiền")
    @Column(nullable = false)
    private String reason;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "bank_id", nullable = false)
    private Bank bank;
}
