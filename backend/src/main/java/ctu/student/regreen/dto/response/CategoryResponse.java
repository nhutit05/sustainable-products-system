package ctu.student.regreen.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryResponse {
    private Integer categoryId;

    private String categoryName;

    private Integer parentId;

    private String parentName;

    private Integer depth;
}
