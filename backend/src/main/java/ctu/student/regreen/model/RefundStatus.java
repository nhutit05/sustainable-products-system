package ctu.student.regreen.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "refund_statuses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RefundStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer refundStatusId;

    @Column(nullable = false, unique = true)
    private String refundStatusName;
}