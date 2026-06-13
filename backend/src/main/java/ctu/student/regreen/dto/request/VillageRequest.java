package ctu.student.regreen.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class VillageRequest {
    @NotBlank(message = "Mã xã không được trống")
    private Integer villageId;
    @NotBlank(message = "Tên xã không được trống")
    @Size(max = 100)
    private String villageName;
    @NotBlank(message = "Cấp xã không được trống")
    private String villageLevel;

    @NotBlank(message = "Mã thành phố không được trống")
    private CityRequest cityRequest;
}

