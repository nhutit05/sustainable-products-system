package ctu.student.regreen.controller;

import ctu.student.regreen.dto.request.CityRequest;
import ctu.student.regreen.dto.response.CityResponse;
import ctu.student.regreen.model.City;
import ctu.student.regreen.service.interfaces.CityService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cities")
@CrossOrigin
@RequiredArgsConstructor
public class CityController {

    private final CityService service;

    // [GET] /api/cities
    @GetMapping
    public List<CityResponse> getAllCities() {
        return service.getAllCities();
    }

    // [GET] /api/cities/{id}
    @GetMapping("/{id}")
    public CityResponse getCityById(@PathVariable Integer id) {
        return service.getCityById(id);
    }

     // [POST] /api/cities
    @PostMapping
    public CityResponse createCity(@RequestBody CityRequest request) {
        return service.create(request);
    }

    // [PUT] /api/cities/{id}
    @PutMapping("/{id}")
    public CityResponse updateCity(@PathVariable Integer id, @RequestBody CityRequest request) {
        return service.updateCity(id, request);
    }

    // [DELETE] /api/cities/{id}
    @DeleteMapping("/{id}")
    public void deleteCity(@PathVariable Integer id) {
        service.deleteCity(id);
    }
}
