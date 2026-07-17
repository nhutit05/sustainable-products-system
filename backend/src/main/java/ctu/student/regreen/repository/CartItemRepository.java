package ctu.student.regreen.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import ctu.student.regreen.model.CartItem;
import ctu.student.regreen.model.CartItemId;

public interface CartItemRepository
        extends JpaRepository<CartItem, CartItemId> {

    List<CartItem> findByCartCartId(Integer cartId);

    @Query("SELECT ci FROM CartItem ci LEFT JOIN FETCH ci.product WHERE ci.cart.cartId = :cartId")
    List<CartItem> findByCartCartIdWithProduct(@Param("cartId") Integer cartId);

}