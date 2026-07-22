package ctu.student.regreen.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryDetailResponse {
    private Integer productId;
    private String productName;
    private String categoryName;
    private Integer inventory;
    private Float price;
}
