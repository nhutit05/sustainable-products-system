package ctu.student.regreen.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import ctu.student.regreen.model.OrderStatus;

public interface OrderStatusRepository extends JpaRepository<OrderStatus, Integer> {
    Optional<OrderStatus> findByOrderStatusName(String orderStatusName);

    boolean existsByOrderStatusName(String orderStatusName);
}
