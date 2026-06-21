package ctu.student.regreen.mapper;

import ctu.student.regreen.dto.request.VillageRequest;
import ctu.student.regreen.dto.response.VillageResponse;
import ctu.student.regreen.model.Village;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class VillageMapper {

    private final CityMapper cityMapper;

    public  VillageResponse toResponse(Village village) {
        return new VillageResponse(
                village.getVillageId(),
                village.getVillageName(),
                village.getVillageLevel(),
                cityMapper.toResponse(village.getCity())
        );
    }

    public  Village toEntity(VillageRequest request) {
        Village village = new Village();
        village.setVillageId(request.getVillageId());
        village.setVillageLevel(request.getVillageLevel());
        village.setVillageName(request.getVillageName());

        village.setCity(cityMapper.toEntity(request.getCityRequest()));

        return village;
    }

    public void update(Village village, VillageRequest request) {
        village.setVillageName(request.getVillageName());
        village.setCity(cityMapper.toEntity(request.getCityRequest()));
    }
}
