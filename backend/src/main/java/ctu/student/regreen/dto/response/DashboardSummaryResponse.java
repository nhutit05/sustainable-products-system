package ctu.student.regreen.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {

    private Long totalOrders;
    private Long totalRevenue;
    private Long totalProducts;
    private Long totalCustomers;
    private Long pendingOrders;
    private Long completedOrders;
    private Long cancelledOrders;
    private Long paidOrders;
}
