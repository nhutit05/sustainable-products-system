package ctu.student.regreen.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Village {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer village_id;
    private String village_name;
    private Integer village_code;

    @ManyToOne
    @JoinColumn(name = "city_id")
    private City city;

    public Village() {
        this.village_id = -1;
        this.village_name = "";
        this.village_code = 0;
        this.city = new City();
    }

    public Village(Integer village_id, String village_name, Integer village_code, City city) {
        this.village_id = village_id;
        this.village_name = village_name;
        this.village_code = village_code;
        this.city = city;
    }

    public Integer getVillage_id() {
        return village_id;
    }

    public void setVillage_id(Integer village_id) {
        this.village_id = village_id;
    }

    public String getVillage_name() {
        return village_name;
    }

    public void setVillage_name(String village_name) {
        this.village_name = village_name;
    }

    public Integer getVillage_code() {
        return village_code;
    }

    public void setVillage_code(Integer village_code) {
        this.village_code = village_code;
    }

    public City getCity() {
        return city;
    }

    public void setCity(City city) {
        this.city = city;
    }

    @Override
    public String toString() {
        return "Village{" +
                "village_id=" + village_id +
                ", village_name='" + village_name + '\'' +
                ", village_code=" + village_code +
                ", city=" + city +
                '}';
    }
}
