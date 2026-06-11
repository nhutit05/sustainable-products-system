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
    @Column(name = "village_id")
    private Integer villageId;

    @Column(nullable = false, name = "village_name")
    @NotBlank
    private String villageName;

    @NotBlank
    @Column(nullable = false, name = "village_level")
    @Pattern(regexp = "^(Xã|Phường|Thị trấn)$")
    private String villageLevel;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "city_id", nullable = false)
    @NotNull
    private City city;
}
