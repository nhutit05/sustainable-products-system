package ctu.student.regreen.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ctu.student.regreen.dto.request.OrderRequest;
import ctu.student.regreen.dto.response.CheckoutResponse;
import ctu.student.regreen.dto.response.OrderResponse;
import ctu.student.regreen.service.interfaces.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
public class OrderController {
    private final OrderService orderService;

    @PostMapping("/checkout")
    public CheckoutResponse checkout(@Valid @RequestBody OrderRequest request) {
        return orderService.checkout(request);
    }

    @GetMapping("/{id}")
    public OrderResponse getById(@PathVariable Integer id) {
        return orderService.getById(id);
    }

    @GetMapping
    public List<OrderResponse> getMyOrders() {
        return orderService.getMyOrders();
    }

    @PutMapping("/{id}/cancel")
    public OrderResponse cancel(@PathVariable Integer id) {
        return orderService.cancel(id);
    }

    @PatchMapping("/{id}/pay")
    public OrderResponse pay(@PathVariable Integer id) {
        return orderService.pay(id);
    }

    @PostMapping("/{orderId}/repay")
    public CheckoutResponse repay(
            @PathVariable Integer orderId) {

        return orderService.repay(orderId);
    }
}