package ctu.student.regreen.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import ctu.student.regreen.model.Order;

public interface OrderRepository extends JpaRepository<Order, Integer>, JpaSpecificationExecutor<Order> {
    List<Order> findByCustomerUserId(Integer userId);
    Optional<Order> findByPayOSOrderCode(Long payOSOrderCode);

    List<Order> findByPaymentStatusPaymentStatusNameAndOrderedAtBefore(
        String paymentStatusName,
        java.time.LocalDateTime orderedAt);
    List<Order> findByPaymentStatusPaymentStatusNameAndOrderedAtAfter(String name, java.time.LocalDateTime expiredTime);
}
