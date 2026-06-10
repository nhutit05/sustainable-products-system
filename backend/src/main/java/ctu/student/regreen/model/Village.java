package ctu.student.regreen.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "villages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "city")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Village {

    @Id
    private Integer village_id;

    @Column(nullable = false)
    @NotBlank
    private String village_name;

    @NotBlank
    @Column(nullable = false)
    @Pattern(regexp = "^(Xã|Phường|Thị trấn)$")
    private String village_level;

    @ManyToOne(fetch = FetchType.LAZY)
    @NotNull
    @JoinColumn(name = "city_id", nullable = false)
    private City city;
}
