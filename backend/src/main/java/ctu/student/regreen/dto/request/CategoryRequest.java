package ctu.student.regreen.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryRequest {
    @NotBlank
    private String categoryName;

    private Integer parentId;
}
