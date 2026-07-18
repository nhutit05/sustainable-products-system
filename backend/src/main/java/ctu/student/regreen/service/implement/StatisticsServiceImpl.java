package ctu.student.regreen.service.implement;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ctu.student.regreen.dto.response.CarbonIndexStatsResponse;
import ctu.student.regreen.dto.response.OrderStatusDistributionResponse;
import ctu.student.regreen.dto.response.RefundStatsResponse;
import ctu.student.regreen.dto.response.RevenueByCategoryResponse;
import ctu.student.regreen.dto.response.ReviewStatsResponse;
import ctu.student.regreen.dto.response.TopCustomerResponse;
import ctu.student.regreen.dto.response.TopProductResponse;
import ctu.student.regreen.dto.response.VoucherStatsResponse;
import ctu.student.regreen.repository.StatisticsRepository;
import ctu.student.regreen.service.interfaces.StatisticsService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StatisticsServiceImpl implements StatisticsService {

    private final StatisticsRepository statisticsRepository;

    @Override
    @Cacheable(value = "stats-revenue-by-category", key = "'all'")
    public List<RevenueByCategoryResponse> getRevenueByCategory() {
        List<RevenueByCategoryResponse> result = statisticsRepository.getRevenueByCategory();
        double totalRevenue = result.stream().mapToDouble(r -> r.getRevenue() != null ? r.getRevenue() : 0.0).sum();
        if (totalRevenue > 0) {
            result.forEach(r -> r.setPercentage(
                    Math.round(r.getRevenue() * 10000.0 / totalRevenue) / 100.0));
        }
        return result;
    }

    @Override
    @Cacheable(value = "stats-top-products", key = "'all-' + #limit")
    public List<TopProductResponse> getTopProducts(Integer limit) {
        List<TopProductResponse> all = statisticsRepository.getTopProducts();
        return all.stream().limit(limit != null ? limit : 10).toList();
    }

    @Override
    @Cacheable(value = "stats-order-status", key = "'all'")
    public List<OrderStatusDistributionResponse> getOrderStatusDistribution() {
        List<OrderStatusDistributionResponse> result = statisticsRepository.getOrderStatusDistribution();
        long totalOrders = result.stream().mapToLong(OrderStatusDistributionResponse::getCount).sum();
        if (totalOrders > 0) {
            result.forEach(r -> r.setPercentage(
                    Math.round(r.getCount() * 10000.0 / totalOrders) / 100.0));
        }
        return result;
    }

    @Override
    @Cacheable(value = "stats-review", key = "'all'")
    public ReviewStatsResponse getReviewStats() {
        double averageRating = statisticsRepository.getAverageReviewRating();
        long totalReviews = statisticsRepository.getTotalReviewCount();

        List<Object[]> distribution = statisticsRepository.getRatingDistribution();
        Map<Integer, Long> ratingMap = new HashMap<>();
        for (Object[] row : distribution) {
            Integer rating = ((Number) row[0]).intValue();
            Long count = ((Number) row[1]).longValue();
            ratingMap.put(rating, count);
        }

        return new ReviewStatsResponse(
                Math.round(averageRating * 100.0) / 100.0,
                totalReviews,
                ratingMap.getOrDefault(1, 0L),
                ratingMap.getOrDefault(2, 0L),
                ratingMap.getOrDefault(3, 0L),
                ratingMap.getOrDefault(4, 0L),
                ratingMap.getOrDefault(5, 0L));
    }

    @Override
    @Cacheable(value = "stats-refund", key = "'all'")
    public RefundStatsResponse getRefundStats() {
        RefundStatsResponse stats = statisticsRepository.getRefundStats();
        if (stats.getTotalRefunds() != null && stats.getTotalRefunds() > 0) {
            long completedOrders = statisticsRepository.getTotalPaidOrdersCount();
            double refundRate = completedOrders > 0
                    ? Math.round(stats.getTotalRefunds() * 10000.0 / completedOrders) / 100.0
                    : 0.0;
            stats.setRefundRate(refundRate);
        } else {
            stats.setRefundRate(0.0);
        }
        return stats;
    }

    @Override
    @Cacheable(value = "stats-voucher", key = "'all'")
    public List<VoucherStatsResponse> getVoucherStats() {
        return statisticsRepository.getVoucherStats();
    }

    @Override
    @Cacheable(value = "stats-carbon", key = "'all'")
    public CarbonIndexStatsResponse getCarbonIndexStats() {
        return statisticsRepository.getCarbonIndexStats();
    }

    @Override
    @Cacheable(value = "stats-top-customers", key = "'all-' + #limit")
    public List<TopCustomerResponse> getTopCustomers(Integer limit) {
        List<TopCustomerResponse> all = statisticsRepository.getTopCustomers();
        List<TopCustomerResponse> result = all.stream().limit(limit != null ? limit : 10).toList();
        result.forEach(c -> c.setAverageOrderValue(
                c.getTotalOrders() > 0
                        ? Math.round(c.getTotalSpent() * 100.0 / c.getTotalOrders()) / 100.0
                        : 0.0));
        return result;
    }
}
