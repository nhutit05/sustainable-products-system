package ctu.student.regreen.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "addresses")
@Getter
@Setter
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

    @ManyToMany
    @JoinTable(name = "user_address", joinColumns = @JoinColumn(name = "address_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
//    danh sach khach hang cung dia chi
    private List<User> users;

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
