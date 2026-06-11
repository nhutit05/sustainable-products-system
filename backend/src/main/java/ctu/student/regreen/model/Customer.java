package ctu.student.regreen.model;

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
public class Customer extends User{
    @NonNull
    @Column(nullable = false, name = "accumulated_eco_points")
    @PositiveOrZero
    private Integer accumulatedEcoPoints =  0;

    @OneToOne(
        mappedBy = "customer",
        fetch = FetchType.LAZY,
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private Cart cart;
}
