package ctu.student.regreen.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RefundStatusResponse {

    private Integer refundStatusId;

    private String refundStatusName;
}