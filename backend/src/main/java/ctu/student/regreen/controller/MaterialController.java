package ctu.student.regreen.controller;

import ctu.student.regreen.model.Material;
import ctu.student.regreen.service.MaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materials")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class MaterialController {

    @Autowired
    MaterialService service;

    // [GET] /api/materials
    @GetMapping
    public List<Material> getAllMaterials() {
        return service.getAllMaterials();
    }

    // [GET] /api/materials/{id}
    @GetMapping("/{id}")
    public Material getMaterialById(@PathVariable Integer id) {
        return service.getMaterialById(id);
    }

    // [POST] /api/materials
    @PostMapping
    public Material createMaterial(@RequestBody Material material) {
        return service.createMaterial(material);
    }

    // [POST] /api/materials/bulk
    @PostMapping("/bulk")
    public List<Material> createMaterials(@RequestBody List<Material> materials) {
        return service.createMaterials(materials);
    }

    // [PUT] /api/materials/{id}
    @PutMapping("/{id}")
    public Material updateMaterial(@PathVariable Integer id, @RequestBody Material material) {
        return service.updateMaterial(id, material);
    }

    // [DELETE] /api/materials/{id}
    @DeleteMapping("/{id}")
    public boolean deleteMaterial(@PathVariable Integer id) {
        return service.deleteMaterial(id);
    }

    // [DELETE] /api/materials
    @DeleteMapping
    public void deleteAllMaterials() {
        service.deleteAllMaterials();
    }
}
