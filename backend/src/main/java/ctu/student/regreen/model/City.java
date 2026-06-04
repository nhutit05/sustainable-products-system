package ctu.student.regreen.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer city_id;
    private String city_name;
    private String city_code;

    public City() {
        this.city_id = -1;
        this.city_name = "";
        this.city_code = "0";
    }

    public City(Integer city_id, String city_name, String city_code) {
        this.city_id = city_id;
        this.city_name = city_name;
        this.city_code = city_code;
    }

    public Integer getCity_id() {
        return city_id;
    }

    public void setCity_id(Integer city_id) {
        this.city_id = city_id;
    }

    public String getCity_name() {
        return city_name;
    }

    public void setCity_name(String city_name) {
        this.city_name = city_name;
    }

    public String getCity_code() {
        return city_code;
    }

    public void setCity_code(String city_code) {
        this.city_code = city_code;
    }

    @Override
    public String toString() {
        return "City{" +
                "city_id=" + city_id +
                ", city_name='" + city_name + '\'' +
                ", city_code=" + city_code +
                '}';
    }
}
