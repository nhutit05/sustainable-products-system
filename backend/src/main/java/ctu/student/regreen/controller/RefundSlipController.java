package ctu.student.regreen.controller;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ctu.student.regreen.dto.request.RefundSlipRequest;
import ctu.student.regreen.dto.response.RefundSlipResponse;
import ctu.student.regreen.service.interfaces.RefundSlipService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/refund-slips")
@RequiredArgsConstructor
public class RefundSlipController {

    private final RefundSlipService service;

    @PostMapping
    public RefundSlipResponse create(
            @RequestBody
            RefundSlipRequest request) {

        return service.create(request);
    }

    @GetMapping("/{id}")
    public RefundSlipResponse getById(
            @PathVariable Integer id) {

        return service.getById(id);
    }

    @GetMapping("/order/{orderId}")
    public RefundSlipResponse getByOrder(
            @PathVariable Integer orderId) {

        return service.getByOrder(orderId);
    }

    @GetMapping
    public List<RefundSlipResponse>
    getMyRefundSlips() {

        return service.getMyRefundSlips();
    }
}