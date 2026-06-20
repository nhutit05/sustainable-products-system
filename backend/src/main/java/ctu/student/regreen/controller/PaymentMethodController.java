package ctu.student.regreen.controller;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ctu.student.regreen.dto.response.PaymentMethodResponse;
import ctu.student.regreen.service.interfaces.PaymentMethodService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payment-methods")
@RequiredArgsConstructor
public class PaymentMethodController {

    private final PaymentMethodService service;

    @GetMapping
    public List<PaymentMethodResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public PaymentMethodResponse getById(@PathVariable Integer id) {
        return service.getById(id);
    }
}