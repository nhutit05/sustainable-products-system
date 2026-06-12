package ctu.student.regreen.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CityRequest {

    @NotBlank(message = "Mã thành phố không được trống")
    private Integer cityId;


    @NotBlank(message = "Tên thành phố không được trống")
    @Size(max = 100)
    private String cityName;

    @NotBlank(message = "Cấp thành phố không được trống")
    private String cityLevel;
}
