package ctu.student.regreen.controller;

import ctu.student.regreen.dto.request.VillageRequest;
import ctu.student.regreen.dto.response.VillageResponse;
import ctu.student.regreen.service.interfaces.VillageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/villages")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class VillageController {

    @Autowired
    VillageService service;

    // [GET] /api/villages
    @GetMapping
    public List<VillageResponse> getAllVillages() {
        return service.getAllVillages();
    }

    // [GET] /api/villages?name={name}
    @GetMapping(params = "name")
    public VillageResponse getAllVillagesByName(@RequestParam String name) {
        return service.getVillageByName(name);
    }


    // [GET] /api/villages/{id}
    @GetMapping("{id}")
    public VillageResponse getVillageById(@PathVariable Integer id) {
        return service.getVillageById(id);
    }

    // [GET] /api/villages/count
    @GetMapping("/count")
    public Integer countVillages() {
        return service.getCountVillages();
    }

    // [POST] /api/villages
    @PostMapping
    public VillageResponse createVillage(@RequestBody VillageRequest village) {
        return service.create(village);
    }

    // PUT] /api/villages/{id}
    @PutMapping("{id}")
    public VillageResponse updateVillage(@PathVariable Integer id,@RequestBody VillageRequest village) {
        return service.updateVillage(id, village);
    }

    // [DELETE] /api/villages/{id}
    @DeleteMapping("{id}")
    public boolean deleteVillage(@PathVariable Integer id) {
        return service.deleteVillage(id);
    }

}
