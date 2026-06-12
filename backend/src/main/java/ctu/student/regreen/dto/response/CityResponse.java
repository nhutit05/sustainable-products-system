package ctu.student.regreen.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CityResponse {

    private Integer cityId;
    private String cityName;
    private String cityLevel;
}
