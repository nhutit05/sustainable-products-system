package ctu.student.regreen.dto.response;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminResponse {

    private Integer userId;

    private String username;

    private String email;

    private String numberPhone;

    private String nationalId;

    private LocalDate hireDate;
}