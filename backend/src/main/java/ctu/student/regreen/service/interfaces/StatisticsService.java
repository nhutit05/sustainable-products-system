package ctu.student.regreen.service.interfaces;

import java.util.List;

import ctu.student.regreen.dto.response.CarbonIndexStatsResponse;
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

public interface StatisticsService {

    List<RevenueByCategoryResponse> getRevenueByCategory(String startDate, String endDate);

    List<RevenueByPeriodResponse> getRevenueByPeriod(String startDate, String endDate, String groupBy);

    List<TopProductResponse> getTopProducts(Integer limit, String startDate, String endDate);

    List<OrderStatusDistributionResponse> getOrderStatusDistribution(String startDate, String endDate);

    ReviewStatsResponse getReviewStats();

    RefundStatsResponse getRefundStats(String startDate, String endDate);

    List<VoucherStatsResponse> getVoucherStats(String startDate, String endDate);

    CarbonIndexStatsResponse getCarbonIndexStats();

    List<TopCustomerResponse> getTopCustomers(Integer limit, String startDate, String endDate);

    InventoryOverviewResponse getInventoryOverview();

    List<NewCustomerStatsResponse> getNewCustomerStats(String startDate, String endDate);
}
