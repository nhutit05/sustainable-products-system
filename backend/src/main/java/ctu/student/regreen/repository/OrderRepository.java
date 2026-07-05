package ctu.student.regreen.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import ctu.student.regreen.model.Order;

public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByCustomerUserId(Integer userId);
    Optional<Order> findByPayOSOrderCode(Long payOSOrderCode);

    List<Order> findByPaymentStatusPaymentStatusNameAndOrderedAtBefore(
        String paymentStatusName,
        LocalDateTime orderedAt);
}