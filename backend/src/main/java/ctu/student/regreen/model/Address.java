package ctu.student.regreen.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "addresses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "address_id")
    private Integer addressId;

    @NotBlank
    @Column(nullable = false, name = "address_name")
    private String addressName;

    @NotBlank
    @Column(nullable = false, name = "address_street")
    private String addressStreet;

    @Column(nullable = false, name = "is_default")
    private Boolean isDefault;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "village_id", nullable = false)
    private Village village;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private Customer customer;

}
