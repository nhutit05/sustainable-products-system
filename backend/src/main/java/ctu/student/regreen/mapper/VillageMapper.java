package ctu.student.regreen.mapper;

import ctu.student.regreen.dto.request.CityRequest;
import ctu.student.regreen.dto.request.VillageRequest;
import ctu.student.regreen.dto.response.VillageResponse;
import ctu.student.regreen.model.City;
import ctu.student.regreen.model.Village;
import org.springframework.stereotype.Component;

@Component
public class VillageMapper {

    public static VillageResponse toResponse(Village village) {
        return new VillageResponse(
                village.getVillageId(),
                village.getVillageName(),
                village.getVillageLevel()
        );
    }

    public static Village toEntity(VillageRequest request, City city) {
        Village village = new Village();
        village.setVillageId(request.getVillageId());
        village.setVillageLevel(request.getVillageLevel());
        village.setVillageName(request.getVillageName());

        village.setCity(city);

        return village;
    }

    public static void update(Village village, VillageRequest request) {
        village.setVillageName(request.getVillageName());
    }
}
