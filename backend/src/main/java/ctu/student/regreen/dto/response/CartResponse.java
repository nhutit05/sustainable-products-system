package ctu.student.regreen.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CartResponse {

    private Integer cartId;

    private LocalDateTime cartedAt;

    private Integer customerId;

    private String customerUsername;
}