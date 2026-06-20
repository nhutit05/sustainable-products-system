package ctu.student.regreen.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import ctu.student.regreen.dto.request.CartItemRequest;
import ctu.student.regreen.dto.response.CartItemResponse;
import ctu.student.regreen.service.interfaces.CartItemService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cart-items")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
public class CartItemController {

    private final CartItemService service;

    // ADD ITEM TO MY CART
    @PostMapping
    public CartItemResponse add(@RequestBody CartItemRequest request) {
        return service.add(request);
    }

    // GET MY CART ITEMS
    @GetMapping
    public List<CartItemResponse> getMyCartItems() {
        return service.getMyCartItems();
    }

    // UPDATE QUANTITY (ONLY PRODUCT ID)
    @PutMapping("/{productId}")
    public CartItemResponse update(
            @PathVariable Integer productId,
            @RequestParam Integer quantity
    ) {
        return service.update(productId, quantity);
    }

    // DELETE ITEM FROM MY CART
    @DeleteMapping("/{productId}")
    public void delete(@PathVariable Integer productId) {
        service.delete(productId);
    }
}