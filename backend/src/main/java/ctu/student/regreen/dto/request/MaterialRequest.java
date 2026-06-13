package ctu.student.regreen.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MaterialRequest {
    @NotBlank(message = "Tên nguyên liệu không được để trống")
    private String materialName;

    @NotNull(message = "Hệ số phát thải không được để trống")
    @DecimalMin(value = "0.0", inclusive = true, message = "Hệ số phát thải phải lớn hơn hoặc bằng 0")
    private Float emissionIndex;
}
