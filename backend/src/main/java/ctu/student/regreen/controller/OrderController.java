package ctu.student.regreen.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ctu.student.regreen.dto.request.OrderRequest;
import ctu.student.regreen.dto.response.OrderResponse;
import ctu.student.regreen.service.interfaces.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService service;

    @PostMapping("/checkout")
    public OrderResponse checkout(
            @Valid @RequestBody
            OrderRequest request) {

        return service.checkout(request);
    }

    @GetMapping("/{id}")
    public OrderResponse getById(
            @PathVariable Integer id) {

        return service.getById(id);
    }

    @GetMapping
    public List<OrderResponse> getMyOrders() {

        return service.getMyOrders();
    }

    @PatchMapping("/{id}/cancel")
    public OrderResponse cancel(
            @PathVariable Integer id) {

        return service.cancel(id);
    }
}