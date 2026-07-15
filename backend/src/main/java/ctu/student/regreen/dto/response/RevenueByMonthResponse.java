package ctu.student.regreen.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RevenueByMonthResponse {

    private Integer year;
    private Integer month;
    private Long revenue;
    private Long orderCount;
}
