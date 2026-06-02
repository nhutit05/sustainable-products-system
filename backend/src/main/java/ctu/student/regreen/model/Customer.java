package ctu.student.regreen.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer user_id;
    private String email, password, username,number_phone, national_id;

    @ManyToMany
    private List<Address> addresses;


}
