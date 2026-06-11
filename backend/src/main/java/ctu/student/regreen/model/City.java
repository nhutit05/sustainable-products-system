package ctu.student.regreen.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Table(name = "cities")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class City {
    @Id
    @NotNull
    @Column(nullable = false, name = "city_id")
    private Integer cityId;

    @NotBlank(message = "Tên tỉnh/thành phố không được trống")
    @Size(max = 100)
    @Column(nullable = false, name = "city_name", length = 100)
    private String cityName;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, name = "city_level", length = 100)
    private String cityLevel;

}
