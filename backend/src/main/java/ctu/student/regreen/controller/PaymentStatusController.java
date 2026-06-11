package ctu.student.regreen.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import ctu.student.regreen.dto.request.PaymentStatusRequest;
import ctu.student.regreen.dto.response.PaymentStatusResponse;
import ctu.student.regreen.service.PaymentStatusService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payment-statuses")
@RequiredArgsConstructor
public class PaymentStatusController {

    private final PaymentStatusService service;

    @PostMapping
    public PaymentStatusResponse create(@RequestBody @Valid PaymentStatusRequest request) {
        return service.create(request);
    }

    @GetMapping("/{id}")
    public PaymentStatusResponse getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @GetMapping
    public List<PaymentStatusResponse> getAll() {
        return service.getAll();
    }

    @PutMapping("/{id}")
    public PaymentStatusResponse update(
            @PathVariable Integer id,
            @RequestBody @Valid PaymentStatusRequest request
    ) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}