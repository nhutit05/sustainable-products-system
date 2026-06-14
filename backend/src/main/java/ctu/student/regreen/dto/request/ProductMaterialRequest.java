package ctu.student.regreen.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProductMaterialRequest {

    @NotBlank
    private Integer productId;

    @NotBlank
    private Integer materialId;

    @NotBlank
    private Float percentage;
}
