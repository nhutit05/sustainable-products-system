package ctu.student.regreen.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
import ctu.student.regreen.service.interfaces.ReportExportService;
import ctu.student.regreen.service.interfaces.StatisticsService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/statistics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class StatisticsController {

    private final StatisticsService statisticsService;
    private final ReportExportService reportExportService;

    @GetMapping("/revenue-by-category")
    public ResponseEntity<List<RevenueByCategoryResponse>> getRevenueByCategory(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return ResponseEntity.ok(statisticsService.getRevenueByCategory(startDate, endDate));
    }

    @GetMapping("/revenue-by-period")
    public ResponseEntity<List<RevenueByPeriodResponse>> getRevenueByPeriod(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "month") String groupBy) {
        return ResponseEntity.ok(statisticsService.getRevenueByPeriod(startDate, endDate, groupBy));
    }

    @GetMapping("/top-products")
    public ResponseEntity<List<TopProductResponse>> getTopProducts(
            @RequestParam(defaultValue = "10") Integer limit,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return ResponseEntity.ok(statisticsService.getTopProducts(limit, startDate, endDate));
    }

    @GetMapping("/order-status-distribution")
    public ResponseEntity<List<OrderStatusDistributionResponse>> getOrderStatusDistribution(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return ResponseEntity.ok(statisticsService.getOrderStatusDistribution(startDate, endDate));
    }

    @GetMapping("/review-stats")
    public ResponseEntity<ReviewStatsResponse> getReviewStats() {
        return ResponseEntity.ok(statisticsService.getReviewStats());
    }

    @GetMapping("/refund-stats")
    public ResponseEntity<RefundStatsResponse> getRefundStats(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return ResponseEntity.ok(statisticsService.getRefundStats(startDate, endDate));
    }

    @GetMapping("/voucher-stats")
    public ResponseEntity<List<VoucherStatsResponse>> getVoucherStats(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return ResponseEntity.ok(statisticsService.getVoucherStats(startDate, endDate));
    }

    @GetMapping("/carbon-index-stats")
    public ResponseEntity<CarbonIndexStatsResponse> getCarbonIndexStats() {
        return ResponseEntity.ok(statisticsService.getCarbonIndexStats());
    }

    @GetMapping("/top-customers")
    public ResponseEntity<List<TopCustomerResponse>> getTopCustomers(
            @RequestParam(defaultValue = "10") Integer limit,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return ResponseEntity.ok(statisticsService.getTopCustomers(limit, startDate, endDate));
    }

    @GetMapping("/inventory-overview")
    public ResponseEntity<InventoryOverviewResponse> getInventoryOverview() {
        return ResponseEntity.ok(statisticsService.getInventoryOverview());
    }

    @GetMapping("/new-customers")
    public ResponseEntity<List<NewCustomerStatsResponse>> getNewCustomerStats(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return ResponseEntity.ok(statisticsService.getNewCustomerStats(startDate, endDate));
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportReport(
            @RequestParam(defaultValue = "excel") String type,
            @RequestParam(defaultValue = "all") String report,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        byte[] data;
        String contentType;
        String filename;

        if ("pdf".equals(type)) {
            data = reportExportService.exportPdf(report, startDate, endDate);
            contentType = "application/pdf";
            filename = "bao-cao-re-green.pdf";
        } else {
            data = reportExportService.exportExcel(report, startDate, endDate);
            contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            filename = "bao-cao-re-green.xlsx";
        }

        return ResponseEntity.ok()
                .header("Content-Type", contentType)
                .header("Content-Disposition", "attachment; filename=" + filename)
                .body(data);
    }
}
