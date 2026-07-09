package ctu.student.regreen.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProductMaterialResponse {

    private Integer productId;
    private String productName;

    private Integer materialId;
    private String materialName;

    private Float percentage;
}
