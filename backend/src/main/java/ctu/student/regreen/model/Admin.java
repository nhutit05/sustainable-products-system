package ctu.student.regreen.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Table(name = "admins")
@Entity
@Getter
@Setter
public class Admin {
    @Id
    private Integer admin_id;

    @OneToOne
    @MapsId
    private User user;

    @Column(nullable = false)
    private LocalDate hired_date;
}
