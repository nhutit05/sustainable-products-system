package ctu.student.regreen.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MaterialResponse {

    private Integer materialId;
    private String materialName;
    private Float emissionIndex;
}
