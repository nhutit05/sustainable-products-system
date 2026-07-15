package ctu.student.regreen.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import ctu.student.regreen.dto.response.DashboardSummaryResponse;
import ctu.student.regreen.dto.response.RecentOrderResponse;
import ctu.student.regreen.dto.response.RevenueByMonthResponse;
import ctu.student.regreen.service.interfaces.DashboardService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse> getSummary() {
        return ResponseEntity.ok(dashboardService.getSummary());
    }

    @GetMapping("/revenue")
    public ResponseEntity<List<RevenueByMonthResponse>> getRevenueByMonth(
            @RequestParam(defaultValue = "2026") Integer year) {
        return ResponseEntity.ok(dashboardService.getRevenueByMonth(year));
    }

    @GetMapping("/recent-orders")
    public ResponseEntity<List<RecentOrderResponse>> getRecentOrders(
            @RequestParam(defaultValue = "10") Integer limit) {
        return ResponseEntity.ok(dashboardService.getRecentOrders(limit));
    }
}
