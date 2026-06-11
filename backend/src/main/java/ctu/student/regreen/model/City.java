package ctu.student.regreen.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "cities")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

public class City {
    @Id
    @Column(name = "city_id", nullable = false, unique = true)
    private Integer cityId;

    @NotBlank(message = "Tên tỉnh/thành phố không được trống")
    @Column(name = "city_name", nullable = false)
    private String cityName;

    @NotBlank
    @Column(name = "city_level", nullable = false)
    private String cityLevel;
}
