package ctu.student.regreen.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import ctu.student.regreen.model.CartItem;
import ctu.student.regreen.model.CartItemId;

public interface CartItemRepository
        extends JpaRepository<CartItem, CartItemId> {

    List<CartItem> findByCartCartId(Integer cartId);

}