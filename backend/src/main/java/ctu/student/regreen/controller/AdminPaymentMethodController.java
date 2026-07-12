package ctu.student.regreen.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ctu.student.regreen.dto.request.PaymentMethodRequest;
import ctu.student.regreen.dto.response.PaymentMethodResponse;
import ctu.student.regreen.service.interfaces.PaymentMethodService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/api/admin/payment-methods")
@RequiredArgsConstructor
public class AdminPaymentMethodController {

    private final PaymentMethodService service;

    @GetMapping
    public List<PaymentMethodResponse> getAll() {
        return service.getAll();
    }


    @PostMapping
    public PaymentMethodResponse create(@RequestBody PaymentMethodRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public PaymentMethodResponse update(@PathVariable Integer id,
                                        @RequestBody PaymentMethodRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

    
}
