package ctu.student.regreen.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopCustomerResponse {
    private Integer customerId;
    private String username;
    private Long totalOrders;
    private Double totalSpent;
    private Double averageOrderValue;
}
