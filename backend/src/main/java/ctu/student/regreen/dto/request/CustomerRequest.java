package ctu.student.regreen.dto.request;

import jakarta.persistence.Column;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NonNull;


@Data
public class CustomerRequest {

    @Column(nullable = false, unique = true, name = "username")
    @NotBlank(message = "Username không được trống.")
    @Size(min = 3, max = 50)
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username chỉ chứa chữ, số và dấu _")
    private String username;

    @Column(nullable = false, unique = true, name = "email")
    @Email
    @Size(max = 100)
    @NotBlank(message = "Email không được trống")
    private String email;

    @Column(nullable = false, unique = true, name = "number_phone")
    @NotBlank(message = "Số điện thoại không được bỏ trống.")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must contain exactly 10 digits")
    private String numberPhone;

    @Column(name = "national_id")
    @Pattern(regexp = "^$|^[0-9]{12}$", message = "CCCD phải gồm 12 chữ số")
    private String nationalId;


    private Boolean isActive;
}
