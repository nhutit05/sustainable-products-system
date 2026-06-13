package ctu.student.regreen.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CartItemResponse {

    private Integer cartId;

    private Integer productId;

    private String productName;

    private Float productPrice;

    private Integer quantity;

    private Float subtotal;
}