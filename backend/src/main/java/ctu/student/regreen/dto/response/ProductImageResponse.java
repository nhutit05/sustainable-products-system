package ctu.student.regreen.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProductImageResponse {

    private Integer productImageId;

    private String imageUrl;

    private Integer productId;
}
