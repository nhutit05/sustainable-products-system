package ctu.student.regreen.controller;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ctu.student.regreen.model.PaymentStatus;
import ctu.student.regreen.service.PaymentStatusService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payment-statuses")
@RequiredArgsConstructor
public class PaymentStatusController {

    private final PaymentStatusService paymentStatusService;

    @GetMapping("/{id}")
    public ResponseEntity<PaymentStatus> getPaymentStatusById(
            @PathVariable Integer id) {

        return paymentStatusService.getPaymentStatusById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<PaymentStatus>> getAllPaymentStatuses() {
        return ResponseEntity.ok(
                paymentStatusService.getAllPaymentStatuses());
    }
}