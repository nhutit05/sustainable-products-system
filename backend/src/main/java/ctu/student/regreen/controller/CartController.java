package ctu.student.regreen.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import ctu.student.regreen.dto.response.CartResponse;
import ctu.student.regreen.service.interfaces.CartService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class CartController {

    private final CartService service;

    @GetMapping("/api/customers/{customerId}/cart")
    public CartResponse getCart(
            @PathVariable Integer customerId) {

        return service.getByCustomerId(customerId);
    }
}