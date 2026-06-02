package ctu.student.regreen.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer address_id;
//    địa chỉ nhà
    private String address_name;
//    Tên đường
    private String address_street;

    @ManyToOne
    @JoinColumn(name = "village_id")
    private Village village;

    @ManyToMany(mappedBy = "addresses")
//    danh sach khach hang cung dia chi
    private List<Customer> customers;

    public Address() {
        this.address_id = -1;
        this.address_name = "";
        this.address_street = "";
        this.village = new Village();
    }

    public Address(Integer address_id, String address_name, String address_street, Village village) {
        this.address_id = address_id;
        this.address_name = address_name;
        this.address_street = address_street;
        this.village = village;
    }

    public Integer getAddress_id() {
        return address_id;
    }

    public void setAddress_id(Integer address_id) {
        this.address_id = address_id;
    }

    public String getAddress_name() {
        return address_name;
    }

    public void setAddress_name(String address_name) {
        this.address_name = address_name;
    }

    public String getAddress_street() {
        return address_street;
    }

    public void setAddress_street(String address_street) {
        this.address_street = address_street;
    }

    public Village getVillage() {
        return village;
    }

    public void setVillage(Village village) {
        this.village = village;
    }

    @Override
    public String toString() {
        return "Address{" +
                "address_id=" + address_id +
                ", address_name='" + address_name + '\'' +
                ", address_street='" + address_street + '\'' +
                ", village=" + village +
                '}';
    }
}
