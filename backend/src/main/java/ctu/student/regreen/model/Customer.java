package ctu.student.regreen.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "customers")
@Getter
@Setter
@ToString(callSuper = true, exclude = "cart")
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@DiscriminatorValue("CUSTOMER")
public class Customer extends User{
    @NonNull
    @Column(nullable = false, name = "accumulated_eco_points")
    @PositiveOrZero
    private Integer accumulatedEcoPoints =  0;

    @Column(nullable = false, name = "is_active")
    private Boolean isActive = true;

    @OneToOne(
        mappedBy = "customer",
        fetch = FetchType.LAZY,
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private Cart cart;

    @Override
    public String getRole() {
        return "ROLE_CUSTOMER";
    }
}
