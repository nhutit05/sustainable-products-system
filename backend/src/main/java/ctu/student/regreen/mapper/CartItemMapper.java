package ctu.student.regreen.mapper;

import org.springframework.stereotype.Component;

import ctu.student.regreen.dto.response.CartItemResponse;
import ctu.student.regreen.model.CartItem;

@Component
public class CartItemMapper {

    public CartItemResponse toResponse(CartItem item) {

        Float productPrice =
                item.getProduct().getProductPrice();

        Float subtotal =
                productPrice * item.getQuantity();

        return new CartItemResponse(
                item.getCart().getCartId(),
                item.getProduct().getProductId(),
                item.getProduct().getProductName(),
                productPrice,
                item.getQuantity(),
                subtotal
        );
    }
}