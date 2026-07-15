package ctu.student.regreen.service.interfaces;

import java.util.List;

import ctu.student.regreen.dto.response.DashboardSummaryResponse;
import ctu.student.regreen.dto.response.RecentOrderResponse;
import ctu.student.regreen.dto.response.RevenueByMonthResponse;

public interface DashboardService {

    DashboardSummaryResponse getSummary();

    List<RevenueByMonthResponse> getRevenueByMonth(Integer year);

    List<RecentOrderResponse> getRecentOrders(Integer limit);
}
