package ctu.student.regreen.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "villages")
@Getter
@Setter
public class Village {

    @Id
    private Integer village_id;
    private String village_name;

    @ManyToOne
    @JoinColumn(name = "city_id")
    private City city;

    public Village() {
        this.village_id = -1;
        this.village_name = "";
        this.city = new City();
    }

    public Village(Integer village_id, String village_name, City city) {
        this.village_id = village_id;
        this.village_name = village_name;
        this.city = city;
    }

    @Override
    public String toString() {
        return "Village{" +
                "village_id=" + village_id +
                ", village_name='" + village_name + '\'' +
                ", city=" + city +
                '}';
    }
}
