package ctu.student.regreen.controller;

import ctu.student.regreen.dto.request.CityRequest;
import ctu.student.regreen.dto.response.CityResponse;
import ctu.student.regreen.dto.response.PageResponse;
import ctu.student.regreen.service.interfaces.CityService;
import lombok.RequiredArgsConstructor;

import org.springframework.security.access.prepost.PreAuthorize;
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
   @PreAuthorize("permitAll")
    public List<CityResponse> getAllCities() {
        return service.getAllCities();
    }

    // [GET] /api/cities/{id}
    @GetMapping("/{id}")
    @PreAuthorize("permitAll")
    public CityResponse getCityById(@PathVariable Integer id) {
        return service.getCityById(id);
    }

     // [POST] /api/cities
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public CityResponse createCity(@RequestBody CityRequest request) {
        return service.create(request);
    }

    // [PUT] /api/cities/{id}
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public CityResponse updateCity(@PathVariable Integer id, @RequestBody CityRequest request) {
        return service.updateCity(id, request);
    }

    // [DELETE] /api/cities/{id}
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteCity(@PathVariable Integer id) {
        service.deleteCity(id);
    }

    // [GET] /api/cities/paginated
    @GetMapping("/paginated")
    @PreAuthorize("hasRole('ADMIN')")
    public PageResponse<CityResponse> getCitiesPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        return service.getCitiesPaginated(page, size, keyword);
    }
}
