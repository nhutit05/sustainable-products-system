package ctu.student.regreen.model;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class OrderItem {
    @EmbeddedId
    private OrderItemId orderItemId;

    @PositiveOrZero
    @NotNull
    @Column(nullable = false)
    private Integer quantity;

    @NotNull
    @PositiveOrZero
    @Column(name = "purchased_price", nullable = false)
    private Integer purchasedPrice;

    @MapsId("order_id")
    @ManyToOne(optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @MapsId("product_id")
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

}
