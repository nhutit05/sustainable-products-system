package ctu.student.regreen.service;

import ctu.student.regreen.model.Material;
import ctu.student.regreen.repository.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaterialService {

    @Autowired
    MaterialRepository repository;

    // [GET] /api/materials
    public List<Material> getAllMaterials() {
        return repository.findAll();
    }

    // [GET] /api/materials/{id}
    public Material getMaterialById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    // [POST] /api/materials
    public Material createMaterial(Material material) {
        return repository.save(material);
    }

    // [POST] /api/materials/bulk
    public List<Material> createMaterials(List<Material> materials) {
        return repository.saveAll(materials);
    }

    // [PUT] /api/materials/{id}
    public Material updateMaterial(Integer id, Material material) {
        Material existingMaterial = repository.findById(id).orElse(null);
        if (existingMaterial != null) {
            return repository.save(material);
        }
        return null;
    }

    // [DELETE] /api/materials/{id}
    public boolean deleteMaterial(Integer id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    // [DELETE] /api/materials
    public void deleteAllMaterials() {
        repository.deleteAll();
    }
}
