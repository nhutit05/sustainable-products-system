package ctu.student.regreen.controller;

import ctu.student.regreen.model.Village;
import ctu.student.regreen.service.VillageService;
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
    public List<Village> getAllVillages() {
        return service.getAllVillages();
    }

    // [GET] /api/villages/{id}
    @GetMapping("{id}")
    public Village getVillageById(@PathVariable Integer id) {
        return service.getVillageById(id);
    }

    // [GET] /api/villages/count
    @GetMapping("/count")
    public Integer countVillages() {
        return service.countVillages();
    }

    // [POST] /api/villages
    @PostMapping
    public Village createVillage(@RequestBody Village village) {
        return service.createVillage(village);
    }

    // [POST] /api/villages/bulk
    @PostMapping("/bulk")
    public List<Village> createVillages(@RequestBody List<Village> villages) {
        return service.createVillages(villages);
    }

    // PUT] /api/villages/{id}
    @PutMapping("{id}")
    public Village updateVillage(@PathVariable Integer id,@RequestBody Village village) {
        return service.updateVillage(id, village);
    }

    // [DELETE] /api/villages/{id}
    @DeleteMapping("{id}")
    public boolean deleteVillage(@PathVariable Integer id) {
        return service.deleteVillage(id);
    }

    // [DELETE] /api/villages
    @DeleteMapping
    public void deleteAllVillages() {
        service.deleteAllVillages();
    }
}
