package ctu.student.regreen.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import ctu.student.regreen.model.Order;

public interface OrderRepository extends JpaRepository<Order, Integer> {

    List<Order> findByCustomerUserId(Integer customerId);

}