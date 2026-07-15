package ctu.student.regreen.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import ctu.student.regreen.model.Order;

public interface DashboardRepository extends JpaRepository<Order, Integer> {

    @Query("SELECT COUNT(o) FROM Order o")
    long countAllOrders();

    @Query("SELECT COALESCE(SUM(oi.purchasedPrice * oi.quantity), 0) FROM Order o JOIN o.orderItems oi WHERE o.paymentStatus.paymentStatusName = 'PAID' AND o.orderedAt >= :start AND o.orderedAt < :end")
    long sumRevenueBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(oi.purchasedPrice * oi.quantity), 0) FROM Order o JOIN o.orderItems oi WHERE o.paymentStatus.paymentStatusName = 'PAID'")
    long sumTotalRevenue();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.orderStatus.orderStatusName = :statusName")
    long countByOrderStatus(@Param("statusName") String statusName);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.paymentStatus.paymentStatusName = :statusName")
    long countByPaymentStatus(@Param("statusName") String statusName);

    List<Order> findTop10ByOrderByOrderedAtDesc();
}
