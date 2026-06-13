package ctu.student.regreen.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AdminRequest {

    @NotBlank
    @Size(min = 3, max = 50)
    @Pattern(regexp = "^[a-zA-Z0-9_]+$")
    private String username;

    @NotBlank
    @Email
    @Size(max = 100)
    private String email;

    @NotBlank
    @Pattern(regexp = "^[0-9]{10}$")
    private String numberPhone;

    @NotBlank
    @Pattern(
        regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).{8,255}$"
    )
    private String password;

    @Pattern(regexp = "^$|^[0-9]{12}$")
    private String nationalId;

    @NotNull
    @PastOrPresent
    private LocalDate hireDate;
}
