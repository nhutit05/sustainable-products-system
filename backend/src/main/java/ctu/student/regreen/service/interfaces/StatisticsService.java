package ctu.student.regreen.service.interfaces;

import java.util.List;

import ctu.student.regreen.dto.response.CarbonIndexStatsResponse;
import ctu.student.regreen.dto.response.OrderStatusDistributionResponse;
import ctu.student.regreen.dto.response.RefundStatsResponse;
import ctu.student.regreen.dto.response.RevenueByCategoryResponse;
import ctu.student.regreen.dto.response.ReviewStatsResponse;
import ctu.student.regreen.dto.response.TopCustomerResponse;
import ctu.student.regreen.dto.response.TopProductResponse;
import ctu.student.regreen.dto.response.VoucherStatsResponse;

public interface StatisticsService {

    List<RevenueByCategoryResponse> getRevenueByCategory();

    List<TopProductResponse> getTopProducts(Integer limit);

    List<OrderStatusDistributionResponse> getOrderStatusDistribution();

    ReviewStatsResponse getReviewStats();

    RefundStatsResponse getRefundStats();

    List<VoucherStatsResponse> getVoucherStats();

    CarbonIndexStatsResponse getCarbonIndexStats();

    List<TopCustomerResponse> getTopCustomers(Integer limit);
}
