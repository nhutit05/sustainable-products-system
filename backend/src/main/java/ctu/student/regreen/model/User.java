package ctu.student.regreen.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="users")
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Integer user_id;

    @Column(nullable = false)
    private String username, email, number_phone, password;

    @Column(nullable = true)
    private String national_id;

    @ManyToMany(mappedBy = "users")
    private List<Address> addresses;
}
