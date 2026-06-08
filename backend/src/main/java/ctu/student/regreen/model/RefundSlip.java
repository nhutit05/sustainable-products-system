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
    private Integer refund_slip_id;

    @NotBlank(message = "So tai khoản ngân hàng không được để trống")
    @Column(nullable = false)
    private String bank_number;
    @NotBlank(message = "Tên chủ tài khoản ngân hàng không được để trống")
    @Column(nullable = false)
    private String account_bank_name;

    @NotBlank(message = "Vui lòng nhập lý do hoàn tiền")
    @Column(nullable = false)
    private String reason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bank_id", nullable = false)
    private Bank bank;
}
