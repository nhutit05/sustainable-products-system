package ctu.student.regreen.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import ctu.student.regreen.dto.response.CarbonIndexStatsResponse;
import ctu.student.regreen.dto.response.OrderStatusDistributionResponse;
import ctu.student.regreen.dto.response.RefundStatsResponse;
import ctu.student.regreen.dto.response.RevenueByCategoryResponse;
import ctu.student.regreen.dto.response.ReviewStatsResponse;
import ctu.student.regreen.dto.response.TopCustomerResponse;
import ctu.student.regreen.dto.response.TopProductResponse;
import ctu.student.regreen.dto.response.VoucherStatsResponse;
import ctu.student.regreen.model.Order;

@Repository
public interface StatisticsRepository extends JpaRepository<Order, Integer> {

    @Query("SELECT new ctu.student.regreen.dto.response.RevenueByCategoryResponse(" +
           "c.categoryId, c.categoryName, " +
           "COALESCE(SUM(oi.purchasedPrice * oi.quantity), 0), " +
           "COUNT(DISTINCT o.orderId), " +
           "0.0) " +
           "FROM Order o JOIN o.orderItems oi JOIN oi.product p JOIN p.category c " +
           "WHERE o.paymentStatus.paymentStatusName = 'PAID' " +
           "GROUP BY c.categoryId, c.categoryName " +
           "ORDER BY SUM(oi.purchasedPrice * oi.quantity) DESC")
    List<RevenueByCategoryResponse> getRevenueByCategory();

    @Query("SELECT new ctu.student.regreen.dto.response.TopProductResponse(" +
           "p.productId, p.productName, c.categoryName, " +
           "SUM(oi.quantity), " +
           "SUM(oi.purchasedPrice * oi.quantity), " +
           "'') " +
           "FROM OrderItem oi JOIN oi.product p JOIN p.category c " +
           "JOIN oi.order o " +
           "WHERE o.paymentStatus.paymentStatusName = 'PAID' " +
           "GROUP BY p.productId, p.productName, c.categoryName " +
           "ORDER BY SUM(oi.quantity) DESC")
    List<TopProductResponse> getTopProducts();

    @Query("SELECT new ctu.student.regreen.dto.response.OrderStatusDistributionResponse(" +
           "o.orderStatus.orderStatusName, COUNT(o), 0.0) " +
           "FROM Order o GROUP BY o.orderStatus.orderStatusName")
    List<OrderStatusDistributionResponse> getOrderStatusDistribution();

    @Query("SELECT COALESCE(AVG(r.reviewRating), 0.0) FROM Review r")
    Double getAverageReviewRating();

    @Query("SELECT COUNT(r) FROM Review r")
    Long getTotalReviewCount();

    @Query("SELECT r.reviewRating, COUNT(r) FROM Review r GROUP BY r.reviewRating")
    List<Object[]> getRatingDistribution();

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
           "FROM RefundSlip rs")
    RefundStatsResponse getRefundStats();

    @Query("SELECT new ctu.student.regreen.dto.response.VoucherStatsResponse(" +
           "v.voucherId, v.code, v.discountValue, " +
           "COUNT(o.orderId), " +
           "COALESCE(SUM(v.discountValue), 0), " +
           "v.isActive) " +
           "FROM Order o JOIN o.voucher v " +
           "GROUP BY v.voucherId, v.code, v.discountValue, v.isActive " +
           "ORDER BY COUNT(o.orderId) DESC")
    List<VoucherStatsResponse> getVoucherStats();

    @Query("SELECT new ctu.student.regreen.dto.response.CarbonIndexStatsResponse(" +
           "COALESCE(AVG(p.productCarbonIndex), 0.0), " +
           "SUM(CASE WHEN p.productCarbonIndex < 5.0 THEN 1 ELSE 0 END), " +
           "SUM(CASE WHEN p.productCarbonIndex >= 5.0 AND p.productCarbonIndex < 15.0 THEN 1 ELSE 0 END), " +
           "SUM(CASE WHEN p.productCarbonIndex >= 15.0 THEN 1 ELSE 0 END), " +
           "COUNT(p)) " +
           "FROM Product p WHERE p.isDeleted = false OR p.isDeleted IS NULL")
    CarbonIndexStatsResponse getCarbonIndexStats();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.paymentStatus.paymentStatusName = 'PAID'")
    long getTotalPaidOrdersCount();

    @Query("SELECT new ctu.student.regreen.dto.response.TopCustomerResponse(" +
           "c.userId, c.username, " +
           "COUNT(DISTINCT o.orderId), " +
           "COALESCE(SUM(oi.purchasedPrice * oi.quantity), 0), " +
           "0.0) " +
           "FROM Order o JOIN o.customer c JOIN o.orderItems oi " +
           "WHERE o.paymentStatus.paymentStatusName = 'PAID' " +
           "GROUP BY c.userId, c.username " +
           "ORDER BY SUM(oi.purchasedPrice * oi.quantity) DESC")
    List<TopCustomerResponse> getTopCustomers();
}
