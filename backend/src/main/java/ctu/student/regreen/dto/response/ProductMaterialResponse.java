package ctu.student.regreen.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProductMaterialResponse {

    private Integer productId;

    private Integer materialId;

    private Float percentage;
}
