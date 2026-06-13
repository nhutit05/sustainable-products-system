package ctu.student.regreen.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class BankResponse {
    private String bankId;
    private String bankShortName;
    private String bankName;
}
