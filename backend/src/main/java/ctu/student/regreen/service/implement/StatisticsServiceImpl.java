package ctu.student.regreen.service.implement;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ctu.student.regreen.dto.response.CarbonIndexStatsResponse;
import ctu.student.regreen.dto.response.InventoryDetailResponse;
import ctu.student.regreen.dto.response.InventoryOverviewResponse;
import ctu.student.regreen.dto.response.NewCustomerStatsResponse;
import ctu.student.regreen.dto.response.OrderStatusDistributionResponse;
import ctu.student.regreen.dto.response.RefundStatsResponse;
import ctu.student.regreen.dto.response.RevenueByCategoryResponse;
import ctu.student.regreen.dto.response.RevenueByPeriodResponse;
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

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private LocalDateTime parseStart(String dateStr) {
        if (dateStr == null || dateStr.isBlank()) return LocalDateTime.of(2000, 1, 1, 0, 0);
        return LocalDate.parse(dateStr, DATE_FMT).atStartOfDay();
    }

    private LocalDateTime parseEnd(String dateStr) {
        if (dateStr == null || dateStr.isBlank()) return LocalDateTime.of(2100, 1, 1, 0, 0);
        return LocalDate.parse(dateStr, DATE_FMT).plusDays(1).atStartOfDay();
    }

    private String dateKey(String startDate, String endDate) {
        return (startDate != null ? startDate : "all") + "_" + (endDate != null ? endDate : "all");
    }

    @Override
    @Cacheable(value = "stats-revenue-by-category", key = "#root.methodName + '-' + (#startDate ?: 'all') + '-' + (#endDate ?: 'all')")
    public List<RevenueByCategoryResponse> getRevenueByCategory(String startDate, String endDate) {
        LocalDateTime start = parseStart(startDate);
        LocalDateTime end = parseEnd(endDate);
        List<RevenueByCategoryResponse> result = statisticsRepository.getRevenueByCategory(start, end);
        double totalRevenue = result.stream().mapToDouble(r -> r.getRevenue() != null ? r.getRevenue() : 0.0).sum();
        if (totalRevenue > 0) {
            result.forEach(r -> r.setPercentage(
                    Math.round(r.getRevenue() * 10000.0 / totalRevenue) / 100.0));
        }
        return result;
    }

    @Override
    @Cacheable(value = "stats-revenue-by-period", key = "#root.methodName + '-' + (#startDate ?: 'all') + '-' + (#endDate ?: 'all') + '-' + (#groupBy ?: 'month')")
    public List<RevenueByPeriodResponse> getRevenueByPeriod(String startDate, String endDate, String groupBy) {
        LocalDateTime start = parseStart(startDate);
        LocalDateTime end = parseEnd(endDate);

        List<Object[]> rawData = statisticsRepository.getRevenueRaw(start, end);

        DateTimeFormatter fmt = "day".equalsIgnoreCase(groupBy)
                ? DateTimeFormatter.ofPattern("yyyy-MM-dd")
                : DateTimeFormatter.ofPattern("yyyy-MM");

        Map<String, RevenueByPeriodResponse> map = new LinkedHashMap<>();
        for (Object[] row : rawData) {
            LocalDateTime dt = (LocalDateTime) row[0];
            String period = dt.format(fmt);
            double rev = ((Number) row[1]).doubleValue();
            long cnt = ((Number) row[2]).longValue();
            map.merge(period,
                    new RevenueByPeriodResponse(period, rev, cnt),
                    (a, b) -> new RevenueByPeriodResponse(period, a.getRevenue() + b.getRevenue(), a.getOrderCount() + b.getOrderCount()));
        }
        return new ArrayList<>(map.values());
    }

    @Override
    @Cacheable(value = "stats-top-products", key = "#root.methodName + '-' + (#limit ?: 10) + '-' + (#startDate ?: 'all') + '-' + (#endDate ?: 'all')")
    public List<TopProductResponse> getTopProducts(Integer limit, String startDate, String endDate) {
        LocalDateTime start = parseStart(startDate);
        LocalDateTime end = parseEnd(endDate);
        List<TopProductResponse> all = statisticsRepository.getTopProducts(start, end);
        return all.stream().limit(limit != null ? limit : 10).toList();
    }

    @Override
    @Cacheable(value = "stats-order-status", key = "#root.methodName + '-' + (#startDate ?: 'all') + '-' + (#endDate ?: 'all')")
    public List<OrderStatusDistributionResponse> getOrderStatusDistribution(String startDate, String endDate) {
        LocalDateTime start = parseStart(startDate);
        LocalDateTime end = parseEnd(endDate);
        List<OrderStatusDistributionResponse> result = statisticsRepository.getOrderStatusDistribution(start, end);
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
    @Cacheable(value = "stats-refund", key = "#root.methodName + '-' + (#startDate ?: 'all') + '-' + (#endDate ?: 'all')")
    public RefundStatsResponse getRefundStats(String startDate, String endDate) {
        LocalDateTime start = parseStart(startDate);
        LocalDateTime end = parseEnd(endDate);
        RefundStatsResponse stats = statisticsRepository.getRefundStats(start, end);
        if (stats.getTotalRefunds() != null && stats.getTotalRefunds() > 0) {
            long completedOrders = statisticsRepository.getTotalPaidOrdersCount(start, end);
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
    @Cacheable(value = "stats-voucher", key = "#root.methodName + '-' + (#startDate ?: 'all') + '-' + (#endDate ?: 'all')")
    public List<VoucherStatsResponse> getVoucherStats(String startDate, String endDate) {
        LocalDateTime start = parseStart(startDate);
        LocalDateTime end = parseEnd(endDate);
        return statisticsRepository.getVoucherStats(start, end);
    }

    @Override
    @Cacheable(value = "stats-carbon", key = "'all'")
    public CarbonIndexStatsResponse getCarbonIndexStats() {
        return statisticsRepository.getCarbonIndexStats();
    }

    @Override
    @Cacheable(value = "stats-top-customers", key = "#root.methodName + '-' + (#limit ?: 10) + '-' + (#startDate ?: 'all') + '-' + (#endDate ?: 'all')")
    public List<TopCustomerResponse> getTopCustomers(Integer limit, String startDate, String endDate) {
        LocalDateTime start = parseStart(startDate);
        LocalDateTime end = parseEnd(endDate);
        List<TopCustomerResponse> all = statisticsRepository.getTopCustomers(start, end);
        List<TopCustomerResponse> result = all.stream().limit(limit != null ? limit : 10).toList();
        result.forEach(c -> c.setAverageOrderValue(
                c.getTotalOrders() > 0
                        ? Math.round(c.getTotalSpent() * 100.0 / c.getTotalOrders()) / 100.0
                        : 0.0));
        return result;
    }

    @Override
    @Cacheable(value = "stats-inventory", key = "'all'")
    public InventoryOverviewResponse getInventoryOverview() {
        List<InventoryDetailResponse> details = statisticsRepository.getInventoryDetails();
        long totalProducts = details.size();
        long lowStock = details.stream().filter(d -> d.getInventory() < 20).count();
        long mediumStock = details.stream().filter(d -> d.getInventory() >= 20 && d.getInventory() < 50).count();
        long highStock = details.stream().filter(d -> d.getInventory() >= 50).count();
        double avgInventory = details.stream().mapToInt(InventoryDetailResponse::getInventory).average().orElse(0.0);

        return new InventoryOverviewResponse(
                totalProducts, lowStock, mediumStock, highStock,
                Math.round(avgInventory * 100.0) / 100.0, details);
    }

    @Override
    public List<NewCustomerStatsResponse> getNewCustomerStats(String startDate, String endDate) {
        LocalDateTime start = parseStart(startDate);
        LocalDateTime end = parseEnd(endDate);
        List<Object[]> rawData = statisticsRepository.getNewCustomerStatsRaw(start, end);

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM");
        List<NewCustomerStatsResponse> result = new ArrayList<>();
        for (Object[] row : rawData) {
            LocalDateTime dt = (LocalDateTime) row[0];
            String period = dt.format(fmt);
            long cnt = ((Number) row[1]).longValue();
            result.add(new NewCustomerStatsResponse(period, cnt));
        }
        return result;
    }
}
