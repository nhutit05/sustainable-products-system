package ctu.student.regreen.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import ctu.student.regreen.dto.request.OrderStatusRequest;
import ctu.student.regreen.dto.response.OrderStatusResponse;
import ctu.student.regreen.service.interfaces.OrderStatusService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/order-statuses")
@RequiredArgsConstructor
public class OrderStatusController {

    private final OrderStatusService service;

    @PostMapping
    public OrderStatusResponse create(
            @Valid @RequestBody OrderStatusRequest request) {

        return service.create(request);
    }

    @GetMapping
    public List<OrderStatusResponse> getAll() {

        return service.getAll();
    }

    @GetMapping("/{id}")
    public OrderStatusResponse getById(
            @PathVariable Integer id) {

        return service.getById(id);
    }

    @PutMapping("/{id}")
    public OrderStatusResponse update(
            @PathVariable Integer id,
            @Valid @RequestBody OrderStatusRequest request) {

        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Integer id) {

        service.delete(id);
    }
}