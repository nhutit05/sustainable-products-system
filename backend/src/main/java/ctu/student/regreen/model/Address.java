package ctu.student.regreen.model;

// import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "addresses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"user", "village"})
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

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "village_id", nullable = false)
    private Village village;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}
