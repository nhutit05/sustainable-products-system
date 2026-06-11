package ctu.student.regreen.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ctu.student.regreen.dto.request.PaymentMethodRequest;
import ctu.student.regreen.dto.response.PaymentMethodResponse;
import ctu.student.regreen.service.interfaces.PaymentMethodService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payment-methods")
@RequiredArgsConstructor
public class PaymentMethodController {

    private final PaymentMethodService service;

    @PostMapping
    public PaymentMethodResponse create(@RequestBody @Valid PaymentMethodRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<PaymentMethodResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public PaymentMethodResponse getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public PaymentMethodResponse update(@PathVariable Integer id,
                                        @RequestBody @Valid PaymentMethodRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}