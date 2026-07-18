package ctu.student.regreen.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RevenueByCategoryResponse {
    private Integer categoryId;
    private String categoryName;
    private Double revenue;
    private Long orderCount;
    private Double percentage;
}
