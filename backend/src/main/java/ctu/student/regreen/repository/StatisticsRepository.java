package ctu.student.regreen.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import ctu.student.regreen.dto.response.CarbonIndexStatsResponse;
import ctu.student.regreen.dto.response.InventoryDetailResponse;
import ctu.student.regreen.dto.response.NewCustomerStatsResponse;
import ctu.student.regreen.dto.response.OrderStatusDistributionResponse;
import ctu.student.regreen.dto.response.RefundStatsResponse;
import ctu.student.regreen.dto.response.RevenueByCategoryResponse;
import ctu.student.regreen.dto.response.RevenueByPeriodResponse;
import ctu.student.regreen.dto.response.ReviewStatsResponse;
import ctu.student.regreen.dto.response.TopCustomerResponse;
import ctu.student.regreen.dto.response.TopProductResponse;
import ctu.student.regreen.dto.response.VoucherStatsResponse;
import ctu.student.regreen.model.Order;

@Repository
public interface StatisticsRepository extends JpaRepository<Order, Integer> {

    // ==================== REVENUE BY CATEGORY (with optional date filter) ====================
    @Query("SELECT new ctu.student.regreen.dto.response.RevenueByCategoryResponse(" +
           "c.categoryId, c.categoryName, " +
           "COALESCE(SUM(oi.purchasedPrice * oi.quantity), 0), " +
           "COUNT(DISTINCT o.orderId), " +
           "0.0) " +
           "FROM Order o JOIN o.orderItems oi JOIN oi.product p JOIN p.category c " +
           "WHERE o.paymentStatus.paymentStatusName = 'PAID' " +
           "AND o.orderedAt >= :startDate " +
           "AND o.orderedAt < :endDate " +
           "GROUP BY c.categoryId, c.categoryName " +
           "ORDER BY SUM(oi.purchasedPrice * oi.quantity) DESC")
    List<RevenueByCategoryResponse> getRevenueByCategory(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    // ==================== TOP PRODUCTS (with optional date filter) ====================
    @Query("SELECT new ctu.student.regreen.dto.response.TopProductResponse(" +
           "p.productId, p.productName, c.categoryName, " +
           "SUM(oi.quantity), " +
           "SUM(oi.purchasedPrice * oi.quantity), " +
           "'') " +
           "FROM OrderItem oi JOIN oi.product p JOIN p.category c " +
           "JOIN oi.order o " +
           "WHERE o.paymentStatus.paymentStatusName = 'PAID' " +
           "AND o.orderedAt >= :startDate " +
           "AND o.orderedAt < :endDate " +
           "GROUP BY p.productId, p.productName, c.categoryName " +
           "ORDER BY SUM(oi.quantity) DESC")
    List<TopProductResponse> getTopProducts(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    // ==================== ORDER STATUS DISTRIBUTION (with optional date filter) ====================
    @Query("SELECT new ctu.student.regreen.dto.response.OrderStatusDistributionResponse(" +
           "o.orderStatus.orderStatusName, COUNT(o), 0.0) " +
           "FROM Order o " +
           "WHERE o.orderedAt >= :startDate " +
           "AND o.orderedAt < :endDate " +
           "GROUP BY o.orderStatus.orderStatusName")
    List<OrderStatusDistributionResponse> getOrderStatusDistribution(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    // ==================== REVIEW STATS ====================
    @Query("SELECT COALESCE(AVG(r.reviewRating), 0.0) FROM Review r")
    Double getAverageReviewRating();

    @Query("SELECT COUNT(r) FROM Review r")
    Long getTotalReviewCount();

    @Query("SELECT r.reviewRating, COUNT(r) FROM Review r GROUP BY r.reviewRating")
    List<Object[]> getRatingDistribution();

    // ==================== REFUND STATS (with optional date filter) ====================
    @Query("SELECT new ctu.student.regreen.dto.response.RefundStatsResponse(" +
           "COUNT(rs), " +
           "SUM(CASE WHEN rs.refundStatus.refundStatusName = 'PENDING' THEN 1 ELSE 0 END), " +
           "SUM(CASE WHEN rs.refundStatus.refundStatusName = 'APPROVED' THEN 1 ELSE 0 END), " +
           "SUM(CASE WHEN rs.refundStatus.refundStatusName = 'REJECTED' THEN 1 ELSE 0 END), " +
           "SUM(CASE WHEN rs.refundStatus.refundStatusName = 'REFUNDED' THEN 1 ELSE 0 END), " +
           "COALESCE(SUM(CASE WHEN rs.refundStatus.refundStatusName = 'REFUNDED' " +
           "THEN (SELECT COALESCE(SUM(oi2.purchasedPrice * oi2.quantity), 0) " +
           "FROM OrderItem oi2 WHERE oi2.order = rs.order) ELSE 0 END), 0), " +
           "0.0) " +
           "FROM RefundSlip rs " +
           "WHERE rs.createdAt >= :startDate " +
           "AND rs.createdAt < :endDate")
    RefundStatsResponse getRefundStats(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    // ==================== VOUCHER STATS ====================
    @Query("SELECT new ctu.student.regreen.dto.response.VoucherStatsResponse(" +
           "v.voucherId, v.code, v.discountValue, " +
           "COUNT(o.orderId), " +
           "COALESCE(SUM(v.discountValue), 0), " +
           "v.isActive) " +
           "FROM Order o JOIN o.voucher v " +
           "WHERE o.orderedAt >= :startDate " +
           "AND o.orderedAt < :endDate " +
           "GROUP BY v.voucherId, v.code, v.discountValue, v.isActive " +
           "ORDER BY COUNT(o.orderId) DESC")
    List<VoucherStatsResponse> getVoucherStats(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    // ==================== CARBON INDEX STATS ====================
    @Query("SELECT new ctu.student.regreen.dto.response.CarbonIndexStatsResponse(" +
           "COALESCE(AVG(p.productCarbonIndex), 0.0), " +
           "SUM(CASE WHEN p.productCarbonIndex < 5.0 THEN 1 ELSE 0 END), " +
           "SUM(CASE WHEN p.productCarbonIndex >= 5.0 AND p.productCarbonIndex < 15.0 THEN 1 ELSE 0 END), " +
           "SUM(CASE WHEN p.productCarbonIndex >= 15.0 THEN 1 ELSE 0 END), " +
           "COUNT(p)) " +
           "FROM Product p WHERE p.isDeleted = false OR p.isDeleted IS NULL")
    CarbonIndexStatsResponse getCarbonIndexStats();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.paymentStatus.paymentStatusName = 'PAID' " +
           "AND o.orderedAt >= :startDate " +
           "AND o.orderedAt < :endDate")
    long getTotalPaidOrdersCount(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    // ==================== TOP CUSTOMERS (with optional date filter) ====================
    @Query("SELECT new ctu.student.regreen.dto.response.TopCustomerResponse(" +
           "c.userId, c.username, " +
           "COUNT(DISTINCT o.orderId), " +
           "COALESCE(SUM(oi.purchasedPrice * oi.quantity), 0), " +
           "0.0) " +
           "FROM Order o JOIN o.customer c JOIN o.orderItems oi " +
           "WHERE o.paymentStatus.paymentStatusName = 'PAID' " +
           "AND o.orderedAt >= :startDate " +
           "AND o.orderedAt < :endDate " +
           "GROUP BY c.userId, c.username " +
           "ORDER BY SUM(oi.purchasedPrice * oi.quantity) DESC")
    List<TopCustomerResponse> getTopCustomers(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    // ==================== REVENUE BY PERIOD (raw, group in service) ====================
    @Query("SELECT o.orderedAt, " +
           "COALESCE(SUM(oi.purchasedPrice * oi.quantity), 0), " +
           "COUNT(DISTINCT o.orderId) " +
           "FROM Order o JOIN o.orderItems oi " +
           "WHERE o.paymentStatus.paymentStatusName = 'PAID' " +
           "AND o.orderedAt >= :start AND o.orderedAt < :end " +
           "GROUP BY o.orderedAt")
    List<Object[]> getRevenueRaw(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    // ==================== INVENTORY OVERVIEW ====================
    @Query("SELECT new ctu.student.regreen.dto.response.InventoryDetailResponse(" +
           "p.productId, p.productName, c.categoryName, p.inventory, p.productPrice) " +
           "FROM Product p JOIN p.category c " +
           "WHERE (p.isDeleted = false OR p.isDeleted IS NULL) " +
           "ORDER BY p.inventory ASC")
    List<InventoryDetailResponse> getInventoryDetails();

    // ==================== NEW CUSTOMERS (grouped by month) ====================
    @Query(value = "SELECT date_trunc('month', u.created_at) AS month, COUNT(u.user_id) " +
           "FROM users u JOIN customers c ON c.user_id = u.user_id " +
           "WHERE u.created_at >= :start AND u.created_at < :end " +
           "GROUP BY date_trunc('month', u.created_at) " +
           "ORDER BY month",
           nativeQuery = true)
    List<Object[]> getNewCustomerStatsRaw(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);
}
