package ctu.student.regreen.controller;

import ctu.student.regreen.model.City;
import ctu.student.regreen.service.CityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cities")
@CrossOrigin
public class CityController {

    @Autowired
    CityService service;

    // [GET]
    @GetMapping
    public List<City> getAllCities() {
        return service.getAllCities();
    }

    // [GET] /api/city/:id
    @GetMapping("{city_id}")
    public City getCityById(@PathVariable Integer city_id) {
        return service.getCityById(city_id);
    }

    // [GET] /api/city/count
    @GetMapping("/count")
    public Integer countCities() {
        return service.countCities();
    }

    // [POST]
    @PostMapping
    public void addCity(@RequestBody City newCity) {
        service.addCity(newCity);
    }

        // [POST] /api/city/bulk
    @PostMapping("/bulk")
    public void addCities(@RequestBody List<City> newCities) {
        service.addCities(newCities);
    }

    // [PUT] /api/city/:id
    @PutMapping("/{city_id}")
    public void updateCityById(@PathVariable Integer city_id, @RequestBody City newCity) {
        service.updateCityById(city_id, newCity);
    }

    // [DELETE] /api/city
    @DeleteMapping
    public void deleteAllCities() {
        service.deleteAllCity();
    }

    // [DELETE] /api/city/:id
    @DeleteMapping("/{city_id}")
    public void deleteCityById(@PathVariable Integer city_id) {
        service.deleteCityById(city_id);
    }
}
