package ctu.student.regreen.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CartItemRequest {

    @NotNull
    private Integer cartId;

    @NotNull
    private Integer productId;

    @NotNull
    @Positive
    private Integer quantity;
}