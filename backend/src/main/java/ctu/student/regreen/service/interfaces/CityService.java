package ctu.student.regreen.service.interfaces;

import ctu.student.regreen.dto.request.CityRequest;
import ctu.student.regreen.dto.response.CityResponse;
import ctu.student.regreen.dto.response.PageResponse;

import java.util.List;

public interface CityService {

    CityResponse create(CityRequest request);
    List<CityResponse> getAllCities();
    CityResponse getCityById(Integer id);
    CityResponse updateCity(Integer id, CityRequest request);
    void deleteCity(Integer id);

    PageResponse<CityResponse> getCitiesPaginated(int page, int size, String keyword);
}
