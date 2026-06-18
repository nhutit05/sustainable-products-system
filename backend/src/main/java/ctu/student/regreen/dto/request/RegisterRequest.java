package ctu.student.regreen.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank
    private String username;

    @Email
    private String email;

    @Pattern(regexp = "^[0-9]{10}$")
    private String numberPhone;

    @NotBlank
    private String password;
}