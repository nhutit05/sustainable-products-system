package ctu.student.regreen.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"category"})
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Integer productId;

    @Column(nullable = false, length = 150, name = "product_name")
    private String productName;

    @Column(nullable = false, name = "product_price")
    private Float productPrice;

    @Column(nullable = false, name = "product_carbon_index")
    private Float productCarbonIndex;

    @Column(nullable = false, name = "base_eco_points")
    private Integer baseEcoPoints;

    @Column(nullable = false, name = "inventory")
    private Integer inventory;

    @Column(length = 255, name = "original")
    private String original;

    @Column(nullable = false, name = "status_sale")
    private Boolean statusSale;

    @Column(nullable = false, name = "expired_at")
    private LocalDate expiredAt;

    @Column(name = "weight")
    private Float weight;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    private Boolean isDeleted;

}