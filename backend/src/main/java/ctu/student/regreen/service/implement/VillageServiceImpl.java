package ctu.student.regreen.service.implement;

import ctu.student.regreen.dto.request.VillageRequest;
import ctu.student.regreen.dto.response.VillageResponse;
import ctu.student.regreen.exception.ErrorCode;
import ctu.student.regreen.exception.ResourceNotFoundException;
import ctu.student.regreen.mapper.VillageMapper;
import ctu.student.regreen.model.Village;
import ctu.student.regreen.repository.VillageRepository;
import ctu.student.regreen.service.interfaces.VillageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VillageServiceImpl implements VillageService {

    private final VillageRepository repository;

    private final VillageMapper villageMapper;


    public VillageResponse create(VillageRequest request) {
        Village entity = villageMapper.toEntity(request);
        return villageMapper.toResponse(repository.save(entity));
    }

    public List<VillageResponse> getAllVillages(Integer cityId) {
        return repository.findByCityCityId(cityId)
                .stream()
                .map(villageMapper::toResponse)
                .toList();

    }


    public VillageResponse getVillageById(Integer id) {
        Village entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException(ErrorCode.VILLAGE_NOT_FOUND));
        return villageMapper.toResponse(entity);
    }

    public VillageResponse getVillageByName(String name) {
        Village entity = repository.findByVillageName(name).orElseThrow(() -> new ResourceNotFoundException(ErrorCode.VILLAGE_NOT_FOUND));
        return villageMapper.toResponse(entity);
    }

    public VillageResponse updateVillage(Integer id, VillageRequest request) {
        Village entity = repository.findById(id).orElseThrow(() -> new RuntimeException("Not found exception"));
        villageMapper.update(entity, request);
        return villageMapper.toResponse(repository.save(entity));
    }

    public boolean deleteVillage(Integer id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}
