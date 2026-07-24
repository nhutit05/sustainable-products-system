package ctu.student.regreen.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GoogleLoginRequest {
    @NotBlank(message = "Google credential không được để trống")
    private String credential;
}
