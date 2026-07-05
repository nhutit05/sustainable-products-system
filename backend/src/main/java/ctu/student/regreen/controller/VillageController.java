package ctu.student.regreen.controller;

import ctu.student.regreen.dto.request.VillageRequest;
import ctu.student.regreen.dto.response.VillageResponse;
import ctu.student.regreen.service.interfaces.VillageService;
import lombok.RequiredArgsConstructor;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/villages")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
public class VillageController {

   
    private final VillageService service;

    // [GET] /api/villages
    @GetMapping
    @PreAuthorize("permitAll")
    public List<VillageResponse> getAllVillages(@RequestParam(value = "cityId") Integer cityId) {
        return service.getAllVillages(cityId);
    }

//    // [GET] /api/villages?name={name}
//    @GetMapping(params = "name")
//    @PreAuthorize("permitAll")
//    public VillageResponse getAllVillagesByName(@RequestParam String name) {
//        return service.getVillageByName(name);
//    }


    // [GET] /api/villages/{id}
    @GetMapping("{id}")
    @PreAuthorize("permitAll")
    public VillageResponse getVillageById(@PathVariable Integer id) {
        return service.getVillageById(id);
    }

    // [POST] /api/villages
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public VillageResponse createVillage(@RequestBody VillageRequest village) {
        return service.create(village);
    }

    // PUT] /api/villages/{id}
    @PutMapping("{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public VillageResponse updateVillage(@PathVariable Integer id,@RequestBody VillageRequest village) {
        return service.updateVillage(id, village);
    }

    // [DELETE] /api/villages/{id}
    @DeleteMapping("{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public boolean deleteVillage(@PathVariable Integer id) {
        return service.deleteVillage(id);
    }

}
