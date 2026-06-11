package ctu.student.regreen.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "banks")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Bank {

    @Id
    @Column(name = "bank_id", nullable = false, unique = true)
    private String bankId;

    @NotBlank(message = "Tên ngân hàng không được để trống")
    @Column(name = "bank_name", nullable = false)
    private String bankName;
}
