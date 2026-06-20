package ctu.student.regreen.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RefundStatusRequest {

    @NotBlank
    private String refundStatusName;
}