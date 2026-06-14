package ctu.student.regreen.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ctu.student.regreen.dto.response.OrderItemResponse;
import ctu.student.regreen.service.interfaces.OrderItemService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/order-items")
@RequiredArgsConstructor
public class OrderItemController {

    private final OrderItemService service;

    @GetMapping("/order/{orderId}")
    public List<OrderItemResponse> getByOrder(
            @PathVariable Integer orderId) {

        return service.getByOrder(orderId);
    }
}