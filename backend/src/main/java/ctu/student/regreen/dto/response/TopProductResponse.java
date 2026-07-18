package ctu.student.regreen.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopProductResponse {
    private Integer productId;
    private String productName;
    private String categoryName;
    private Long totalQuantity;
    private Double totalRevenue;
    private String productImage;
}
