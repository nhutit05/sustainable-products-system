package ctu.student.regreen.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryOverviewResponse {
    private Long totalProducts;
    private Long lowStockCount;
    private Long mediumStockCount;
    private Long highStockCount;
    private Double averageInventory;
    private List<InventoryDetailResponse> details;
}
