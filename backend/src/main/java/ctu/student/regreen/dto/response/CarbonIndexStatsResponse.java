package ctu.student.regreen.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarbonIndexStatsResponse {
    private Double averageCarbonIndex;
    private Long lowCarbonCount;
    private Long mediumCarbonCount;
    private Long highCarbonCount;
    private Long totalProducts;
}
