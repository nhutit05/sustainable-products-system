package ctu.student.regreen.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class RecommendationResponse {
    private Integer productId;
    private List<ProductRecommendation> recommendations;
}
