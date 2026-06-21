package ctu.student.regreen.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ctu.student.regreen.dto.response.RefundSlipResponse;
import ctu.student.regreen.service.interfaces.AdminRefundSlipService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/refund-slips")
@RequiredArgsConstructor
public class AdminRefundSlipController {

    private final AdminRefundSlipService service;

    @GetMapping
    public List<RefundSlipResponse>
    getAllRefundSlips() {

        return service.getAllRefundSlips();
    }

    @GetMapping("/{id}")
    public RefundSlipResponse getById(
            @PathVariable Integer id) {

        return service.getRefundSlipById(id);
    }

    @PatchMapping("/{id}/approve")
    public RefundSlipResponse approve(
            @PathVariable Integer id) {

        return service.approveRefund(id);
    }

    @PatchMapping("/{id}/reject")
    public RefundSlipResponse reject(
            @PathVariable Integer id) {

        return service.rejectRefund(id);
    }

    @PatchMapping("/{id}/refunded")
    public RefundSlipResponse refunded(
            @PathVariable Integer id) {

        return service.markRefunded(id);
    }
}