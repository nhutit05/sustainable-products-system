package ctu.student.regreen.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProductImageRequest {
    @NotBlank
    private String imageUrl;
}
