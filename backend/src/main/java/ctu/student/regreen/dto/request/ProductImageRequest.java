package ctu.student.regreen.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProductImageRequest {
    @NotBlank
    private String imageUrl;

    @NotBlank
    private Integer productId;
}
