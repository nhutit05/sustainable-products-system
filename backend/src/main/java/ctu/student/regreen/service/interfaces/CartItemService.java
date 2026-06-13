package ctu.student.regreen.service.interfaces;

import java.util.List;

import ctu.student.regreen.dto.request.CartItemRequest;
import ctu.student.regreen.dto.response.CartItemResponse;

public interface CartItemService {

    CartItemResponse add(CartItemRequest request);

    List<CartItemResponse> getByCart(Integer cartId);

    CartItemResponse update(
            Integer cartId,
            Integer productId,
            Integer quantity);

    void delete(
            Integer cartId,
            Integer productId);
}