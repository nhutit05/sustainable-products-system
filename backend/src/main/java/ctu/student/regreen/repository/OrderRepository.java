package ctu.student.regreen.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import ctu.student.regreen.model.Order;

public interface OrderRepository extends JpaRepository<Order, Integer>, JpaSpecificationExecutor<Order> {
    List<Order> findByCustomerUserId(Integer userId);
    Optional<Order> findByPayOSOrderCode(Long payOSOrderCode);

    List<Order> findByPaymentStatusPaymentStatusNameAndOrderedAtBefore(
        String paymentStatusName,
        java.time.LocalDateTime orderedAt);
    List<Order> findByPaymentStatusPaymentStatusNameAndOrderedAtAfter(String name, java.time.LocalDateTime expiredTime);

    @Query("SELECT o FROM Order o " +
           "LEFT JOIN FETCH o.customer " +
           "LEFT JOIN FETCH o.paymentMethod " +
           "LEFT JOIN FETCH o.orderStatus " +
           "LEFT JOIN FETCH o.paymentStatus " +
           "LEFT JOIN FETCH o.voucher " +
           "LEFT JOIN FETCH o.orderItems oi " +
           "LEFT JOIN FETCH oi.product " +
           "WHERE o.orderId = :orderId")
    Optional<Order> findByIdWithDetails(@Param("orderId") Integer orderId);
}
