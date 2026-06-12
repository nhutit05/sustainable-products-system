package ctu.student.regreen.mapper;

import ctu.student.regreen.dto.request.CityRequest;
import ctu.student.regreen.dto.response.CityResponse;
import ctu.student.regreen.model.City;
import org.springframework.stereotype.Component;

@Component
public class CityMapper {

    public static CityResponse toResponse(City city) {
        return new CityResponse(
                city.getCityId(),
                city.getCityName(),
                city.getCityLevel()
        );
    }

    public static City toEntity(CityRequest request) {
        City city = new City();
        city.setCityName(request.getCityName());
        city.setCityId(request.getCityId());
        city.setCityLevel(request.getCityLevel());
        return city;
    }

        public static void update(City city, CityRequest request) {
            city.setCityName(request.getCityName());
        }
}
