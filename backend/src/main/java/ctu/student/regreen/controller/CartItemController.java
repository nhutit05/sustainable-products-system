package ctu.student.regreen.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import ctu.student.regreen.dto.request.CartItemRequest;
import ctu.student.regreen.dto.response.CartItemResponse;
import ctu.student.regreen.service.interfaces.CartItemService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cart-items")
@RequiredArgsConstructor
public class CartItemController {

    private final CartItemService service;

    @PostMapping
    public CartItemResponse add(
            @Valid @RequestBody CartItemRequest request) {

        return service.add(request);
    }

    @GetMapping("/cart/{cartId}")
    public List<CartItemResponse> getByCart(
            @PathVariable Integer cartId) {

        return service.getByCart(cartId);
    }

    @PutMapping("/{cartId}/{productId}")
    public CartItemResponse update(
            @PathVariable Integer cartId,
            @PathVariable Integer productId,
            @RequestParam Integer quantity) {

        return service.update(
                cartId,
                productId,
                quantity);
    }

    @DeleteMapping("/{cartId}/{productId}")
    public void delete(
            @PathVariable Integer cartId,
            @PathVariable Integer productId) {

        service.delete(cartId, productId);
    }
}