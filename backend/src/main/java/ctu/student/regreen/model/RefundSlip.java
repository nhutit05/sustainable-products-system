package ctu.student.regreen.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "refund_slips", indexes = {
    @Index(name = "idx_refund_order_id", columnList = "order_id"),
    @Index(name = "idx_refund_status_id", columnList = "refund_status_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = { "order", "bank" })
public class RefundSlip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "refund_slip_id")
    private Integer refundSlipId;

    @Column(name = "bank_number", nullable = false, length = 20)
    private String bankNumber;

    @Column(name = "account_bank_name", nullable = false)
    private String accountBankName;

    @Column(name = "reason", nullable = false)
    private String reason;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "bank_id", nullable = false)
    private Bank bank;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "refund_status_id", nullable = false)
    private RefundStatus refundStatus;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}