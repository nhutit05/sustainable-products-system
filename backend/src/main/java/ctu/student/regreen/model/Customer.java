package ctu.student.regreen.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "customers")
@Getter
@Setter
public class Customer {
    @Id
    private Integer customer_id;

    @OneToOne
    @MapsId
    private User user;

    private Float current_eco_points, accumulated_eco_points;
}
