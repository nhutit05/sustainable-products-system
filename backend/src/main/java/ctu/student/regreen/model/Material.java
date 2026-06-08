package ctu.student.regreen.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "materials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Material {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Integer material_id;

    @NotBlank(message = "Tên vật liệu không được trống")
    @Size(max = 150, message = "Tên vật liệu tối đa 150 ký tự")
    @Column(nullable = false, unique = true)
    private String material_name;

//    Hệ số phát thải (emission index) của vật liệu, đơn vị kg CO2e/kg vật liệu
    @NotNull(message = "Hệ số phát thải không được trống")
    @DecimalMin(value = "0.0", inclusive = true, message = "Hệ số phát thải phải lớn hơn hoặc bằng 0")
    @Column(nullable = false)
    private Float emission_index;
}
