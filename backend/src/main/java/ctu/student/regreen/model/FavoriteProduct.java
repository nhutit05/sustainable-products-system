package ctu.student.regreen.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "favorite_products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteProduct {

    @EmbeddedId
    private FavoriteProductId id;

    @MapsId("product_id")
    @ManyToOne(fetch = jakarta.persistence.FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @MapsId("user_id")
    @ManyToOne(fetch = jakarta.persistence.FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Customer customer;
}
