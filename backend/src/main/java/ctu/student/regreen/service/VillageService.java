package ctu.student.regreen.service;

import ctu.student.regreen.model.Village;
import ctu.student.regreen.repository.VillageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VillageService {

    @Autowired
    VillageRepository repository;

    // [GET] /api/villages
    public List<Village> getAllVillages() {
        return repository.findAll();
    }

    // [GET] /api/villages/{id}
    public Village getVillageById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    // [GET] /api/villages/count
    public Integer countVillages() {
        return (int) repository.count();
    }

    // [POST] /api/villages
    public Village createVillage(Village village) {
        return repository.save(village);
    }

    // PUT] /api/villages/{id}
    public Village updateVillage(Integer id, Village village) {
        Village existingVillage = repository.findById(id).orElse(null);
        if (existingVillage != null) {
            return repository.save(existingVillage);
        }
        return null;
    }

    // [DELETE] /api/villages/{id}
    public boolean deleteVillage(Integer id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    // [DELETE] /api/villages
    public void deleteAllVillages() {
        repository.deleteAll();
    }
}
