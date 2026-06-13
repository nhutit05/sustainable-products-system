package ctu.student.regreen.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class CustomerResponse {

    private Integer userId;

    private String username;

    private String email;

    private String numberPhone;

    private String nationalId;

    private Integer accumulatedEcoPoints;

}
