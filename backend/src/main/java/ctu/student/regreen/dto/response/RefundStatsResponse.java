package ctu.student.regreen.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RefundStatsResponse {
    private Long totalRefunds;
    private Long pendingCount;
    private Long approvedCount;
    private Long rejectedCount;
    private Long refundedCount;
    private Double totalRefundAmount;
    private Double refundRate;
}
