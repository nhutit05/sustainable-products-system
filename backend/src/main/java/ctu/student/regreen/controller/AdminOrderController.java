package ctu.student.regreen.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import ctu.student.regreen.dto.response.OrderResponse;
import ctu.student.regreen.service.interfaces.AdminOrderService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final AdminOrderService service;

    @GetMapping
    public List<OrderResponse> getAllOrders() {

        return service.getAllOrders();
    }

    @GetMapping("/{id}")
    public OrderResponse getOrderById(
            @PathVariable Integer id) {

        return service.getOrderById(id);
    }

    @PatchMapping("/{id}/confirm")
    public OrderResponse confirmOrder(
            @PathVariable Integer id) {

        return service.confirmOrder(id);
    }

    @PatchMapping("/{id}/shipping")
    public OrderResponse shippingOrder(
            @PathVariable Integer id) {

        return service.shippingOrder(id);
    }

    @PatchMapping("/{id}/complete")
    public OrderResponse completeOrder(
            @PathVariable Integer id) {

        return service.completeOrder(id);
    }

    @PatchMapping("/{id}/reject")
    public OrderResponse rejectOrder(
            @PathVariable Integer id) {

        return service.rejectOrder(id);
    }
}