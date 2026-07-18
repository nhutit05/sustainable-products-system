package ctu.student.regreen.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ctu.student.regreen.dto.response.CarbonIndexStatsResponse;
import ctu.student.regreen.dto.response.OrderStatusDistributionResponse;
import ctu.student.regreen.dto.response.RefundStatsResponse;
import ctu.student.regreen.dto.response.RevenueByCategoryResponse;
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
    public ResponseEntity<List<RevenueByCategoryResponse>> getRevenueByCategory() {
        return ResponseEntity.ok(statisticsService.getRevenueByCategory());
    }

    @GetMapping("/top-products")
    public ResponseEntity<List<TopProductResponse>> getTopProducts(
            @RequestParam(defaultValue = "10") Integer limit) {
        return ResponseEntity.ok(statisticsService.getTopProducts(limit));
    }

    @GetMapping("/order-status-distribution")
    public ResponseEntity<List<OrderStatusDistributionResponse>> getOrderStatusDistribution() {
        return ResponseEntity.ok(statisticsService.getOrderStatusDistribution());
    }

    @GetMapping("/review-stats")
    public ResponseEntity<ReviewStatsResponse> getReviewStats() {
        return ResponseEntity.ok(statisticsService.getReviewStats());
    }

    @GetMapping("/refund-stats")
    public ResponseEntity<RefundStatsResponse> getRefundStats() {
        return ResponseEntity.ok(statisticsService.getRefundStats());
    }

    @GetMapping("/voucher-stats")
    public ResponseEntity<List<VoucherStatsResponse>> getVoucherStats() {
        return ResponseEntity.ok(statisticsService.getVoucherStats());
    }

    @GetMapping("/carbon-index-stats")
    public ResponseEntity<CarbonIndexStatsResponse> getCarbonIndexStats() {
        return ResponseEntity.ok(statisticsService.getCarbonIndexStats());
    }

    @GetMapping("/top-customers")
    public ResponseEntity<List<TopCustomerResponse>> getTopCustomers(
            @RequestParam(defaultValue = "10") Integer limit) {
        return ResponseEntity.ok(statisticsService.getTopCustomers(limit));
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportReport(
            @RequestParam(defaultValue = "excel") String type,
            @RequestParam(defaultValue = "all") String report) {
        byte[] data;
        String contentType;
        String filename;

        if ("pdf".equals(type)) {
            data = reportExportService.exportPdf(report);
            contentType = "application/pdf";
            filename = "bao-cao-re-green.pdf";
        } else {
            data = reportExportService.exportExcel(report);
            contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            filename = "bao-cao-re-green.xlsx";
        }

        return ResponseEntity.ok()
                .header("Content-Type", contentType)
                .header("Content-Disposition", "attachment; filename=" + filename)
                .body(data);
    }
}
