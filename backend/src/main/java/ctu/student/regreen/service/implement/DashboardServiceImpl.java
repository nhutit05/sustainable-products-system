package ctu.student.regreen.service.implement;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ctu.student.regreen.dto.response.DashboardSummaryResponse;
import ctu.student.regreen.dto.response.RecentOrderResponse;
import ctu.student.regreen.dto.response.RevenueByMonthResponse;
import ctu.student.regreen.repository.CustomerRepository;
import ctu.student.regreen.repository.DashboardRepository;
import ctu.student.regreen.repository.ProductRepository;
import ctu.student.regreen.service.interfaces.DashboardService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final DashboardRepository dashboardRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;

    @Override
    public DashboardSummaryResponse getSummary() {
        long totalOrders = dashboardRepository.countAllOrders();
        long totalRevenue = dashboardRepository.sumTotalRevenue();
        long totalProducts = productRepository.count();
        long totalCustomers = customerRepository.count();
        long pendingOrders = dashboardRepository.countByOrderStatus("PENDING");
        long completedOrders = dashboardRepository.countByOrderStatus("COMPLETED");
        long cancelledOrders = dashboardRepository.countByOrderStatus("CANCELLED");
        long paidOrders = dashboardRepository.countByPaymentStatus("PAID");

        return new DashboardSummaryResponse(
                totalOrders,
                totalRevenue,
                totalProducts,
                totalCustomers,
                pendingOrders,
                completedOrders,
                cancelledOrders,
                paidOrders);
    }

    @Override
    public List<RevenueByMonthResponse> getRevenueByMonth(Integer year) {
        List<RevenueByMonthResponse> result = new ArrayList<>();

        for (int month = 1; month <= 12; month++) {
            YearMonth ym = YearMonth.of(year, month);
            LocalDateTime start = ym.atDay(1).atStartOfDay();
            LocalDateTime end = ym.plusMonths(1).atDay(1).atStartOfDay();

            long revenue = dashboardRepository.sumRevenueBetween(start, end);

            result.add(new RevenueByMonthResponse(year, month, revenue, 0L));
        }

        return result;
    }

    @Override
    public List<RecentOrderResponse> getRecentOrders(Integer limit) {
        List<ctu.student.regreen.model.Order> orders = dashboardRepository.findTop10ByOrderByOrderedAtDesc();

        return orders.stream()
                .limit(limit != null ? limit : 10)
                .map(o -> new RecentOrderResponse(
                        o.getOrderId(),
                        o.getOrderedAt(),
                        o.getCustomer().getUsername(),
                        o.getOrderItems().stream()
                                .mapToDouble(oi -> oi.getPurchasedPrice() * oi.getQuantity())
                                .sum() != 0
                                ? (float) o.getOrderItems().stream()
                                        .mapToDouble(oi -> oi.getPurchasedPrice() * oi.getQuantity())
                                        .sum()
                                : 0f,
                        o.getOrderStatus().getOrderStatusName(),
                        o.getPaymentStatus().getPaymentStatusName()))
                .toList();
    }
}
