package ctu.student.regreen.service.interfaces;

import ctu.student.regreen.dto.request.VillageRequest;
import ctu.student.regreen.dto.response.VillageResponse;

import java.util.List;


public interface VillageService {
    VillageResponse create(VillageRequest request);

    List<VillageResponse> getAllVillages(Integer cityId);

    VillageResponse getVillageById(Integer id);

    VillageResponse getVillageByName(String name);

    VillageResponse updateVillage(Integer id, VillageRequest request);

    boolean deleteVillage(Integer id);

//    int getCountVillages();
}
