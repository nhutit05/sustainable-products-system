package ctu.student.regreen.dto.response;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderItemResponse {

    private Integer productId;
    private String productName;

    private Integer quantity;
    private Float purchasedPrice;
    private Float subTotal;
}