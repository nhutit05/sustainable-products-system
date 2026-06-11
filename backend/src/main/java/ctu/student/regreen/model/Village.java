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
    @Column(name = "village_id", nullable = false, updatable = false)
    private Integer villageId;

    @Column(name = "village_name", nullable = false)
    @NotBlank
    private String villageName;

    @NotBlank
    @Column(name = "village_level", nullable = false)
    @Pattern(regexp = "^(Xã|Phường|Thị trấn)$")
    private String villageLevel;

    @ManyToOne(fetch = FetchType.LAZY)
    @NotNull
    @JoinColumn(name = "city_id", nullable = false)
    private City city;
}
