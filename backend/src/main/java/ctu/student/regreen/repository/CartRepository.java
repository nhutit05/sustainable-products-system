package ctu.student.regreen.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import ctu.student.regreen.model.Cart;

public interface CartRepository extends JpaRepository<Cart, Integer> {

    Optional<Cart> findByCustomerUserId(Integer userId);
    Optional<Cart> findByCustomerUsername(String username);

}