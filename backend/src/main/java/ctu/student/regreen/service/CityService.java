package ctu.student.regreen.service;

import ctu.student.regreen.model.City;
import ctu.student.regreen.repository.CityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CityService {
    @Autowired
    private CityRepository repository;

    // [GET] /api/city
    public List<City> getAllCities() {
        return repository.findAll();
    }

    // [GET] /api/city/:id
    public City getCityById(Integer city_id) {
        return repository.findById(city_id).orElse(null);
    }

    // [POST] /api/city
    public void addCity(City new_City) {
        repository.save(new_City);
    }

    // PUT /api/city/:id
    public void updateCityById(Integer city_id, City newCity) {
        City foundCity = getCityById(city_id);
        if (foundCity != null) {
            repository.save(newCity);
        } else {
            System.out.println("Không tìm thấy thành phố có city_id = " + city_id);
        }
    }

    // [DELETE] /api/city
    public void deleteAllCity() {
        repository.deleteAll();
    }

    // [DELETE] /api/city/:id
    public void deleteCityById(Integer city_id) {
        repository.deleteById(city_id);
    }

}
