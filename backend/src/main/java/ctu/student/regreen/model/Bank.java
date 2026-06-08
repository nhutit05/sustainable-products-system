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
    private String bank_id;

    @NotBlank(message = "Tên ngân hàng không được để trống")
    @Column(nullable = false)
    private String bank_name;
}
