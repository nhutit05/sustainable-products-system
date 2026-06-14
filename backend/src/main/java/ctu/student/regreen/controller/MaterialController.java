package ctu.student.regreen.controller;

import ctu.student.regreen.dto.request.MaterialRequest;
import ctu.student.regreen.dto.response.MaterialResponse;
import ctu.student.regreen.service.interfaces.MaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materials")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
public class MaterialController {

    private final MaterialService service;

    // [GET] /api/materials
    @GetMapping
    public List<MaterialResponse> getAllMaterials() {
        return service.getAll();
    }

    // [GET] /api/materials/{id}
    @GetMapping("/{id}")
    public MaterialResponse getMaterialById(@PathVariable Integer id) {
        return service.getById(id);
    }

    // [POST] /api/materials
    @PostMapping
    public MaterialResponse createMaterial(@RequestBody MaterialRequest material) {
        return service.create(material);
    }

    // [PUT] /api/materials/{id}
    @PutMapping("/{id}")
    public MaterialResponse updateMaterial(@PathVariable Integer id, @RequestBody MaterialRequest material) {
        return service.update(id, material);
    }

    // [DELETE] /api/materials/{id}
    @DeleteMapping("/{id}")
    public Boolean deleteMaterial(@PathVariable Integer id) {
        return service.delete(id);
    }
}
