package ctu.student.regreen.mapper;

import ctu.student.regreen.dto.request.VillageRequest;
import ctu.student.regreen.dto.response.VillageResponse;
import ctu.student.regreen.model.City;
import ctu.student.regreen.model.Village;
import org.springframework.stereotype.Component;

@Component
public class VillageMapper {

    public  VillageResponse toResponse(Village village) {
        return new VillageResponse(
                village.getVillageId(),
                village.getVillageName(),
                village.getVillageLevel(),
                CityMapper.toResponse(village.getCity())
        );
    }

    public  Village toEntity(VillageRequest request) {
        Village village = new Village();
        village.setVillageId(request.getVillageId());
        village.setVillageLevel(request.getVillageLevel());
        village.setVillageName(request.getVillageName());

        village.setCity(CityMapper.toEntity(request.getCityRequest()));

        return village;
    }

    public  void update(Village village, VillageRequest request) {
        village.setVillageName(request.getVillageName());
    }
}
