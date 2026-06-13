package ctu.student.regreen.mapper;

import org.springframework.stereotype.Component;

import ctu.student.regreen.dto.response.CartResponse;
import ctu.student.regreen.model.Cart;

@Component
public class CartMapper {

    public CartResponse toResponse(Cart cart) {

        return new CartResponse(
                cart.getCartId(),
                cart.getCartedAt(),
                cart.getCustomer().getUserId(),
                cart.getCustomer().getUsername()
        );
    }
}