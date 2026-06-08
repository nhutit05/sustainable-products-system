package ctu.student.regreen.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "carts")
@Getter
@Setter
@ToString(exclude = "customer")
@NoArgsConstructor
@AllArgsConstructor
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cart_id;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime carted_at;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(nullable = false, name = "user_id", unique = true)
    private Customer customer;

    @OneToMany(mappedBy = "cart")
    private List<CartItem> cart_items = new ArrayList<>();

}
