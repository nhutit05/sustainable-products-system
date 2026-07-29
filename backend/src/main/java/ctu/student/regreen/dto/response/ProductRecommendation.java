package ctu.student.regreen.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductRecommendation {
    private Integer productId;
    private String productName;
    private Float productPrice;
    private Float productCarbonIndex;
    private Integer baseEcoPoints;
    private String imageUrl;
    private Integer categoryId;
    private String categoryName;
    private String matchReason;
}
