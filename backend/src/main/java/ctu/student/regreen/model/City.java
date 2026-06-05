package ctu.student.regreen.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Table(name = "cities")
@Entity
@Getter
@Setter
public class City {
    @Id
    private Integer city_id;
    private String city_name;
    private String city_level;

    public City() {
        this.city_id = -1;
        this.city_name = "";
        this.city_level = "Tỉnh";
    }

    public City(Integer city_id, String city_name, String city_level) {
        this.city_id = city_id;
        this.city_name = city_name;
        this.city_level = city_level;
    }

    @Override
    public String toString() {
        return "City{" +
                "city_id=" + city_id +
                ", city_name='" + city_name + '\'' +
                ", city_level='" + city_level + '\'' +
                '}';
    }
}
