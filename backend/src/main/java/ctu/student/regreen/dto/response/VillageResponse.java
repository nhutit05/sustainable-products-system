package ctu.student.regreen.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VillageResponse {

    private Integer villageId;
    private String villageName;
    private String villageLevel;
    private CityResponse city;
}
