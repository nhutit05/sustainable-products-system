package ctu.student.regreen.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import ctu.student.regreen.dto.response.OrderResponse;
import ctu.student.regreen.service.interfaces.AdminOrderService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAll() {
        return ResponseEntity.ok(adminOrderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(adminOrderService.getOrderById(id));
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<OrderResponse> confirm(@PathVariable Integer id) {
        return ResponseEntity.ok(adminOrderService.confirmOrder(id));
    }

    @PutMapping("/{id}/shipping")
    public ResponseEntity<OrderResponse> shipping(@PathVariable Integer id) {
        return ResponseEntity.ok(adminOrderService.shippingOrder(id));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<OrderResponse> complete(@PathVariable Integer id) {
        return ResponseEntity.ok(adminOrderService.completeOrder(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<OrderResponse> reject(@PathVariable Integer id) {
        return ResponseEntity.ok(adminOrderService.rejectOrder(id));
    }
}