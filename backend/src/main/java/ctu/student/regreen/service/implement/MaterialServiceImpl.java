package ctu.student.regreen.service.implement;

import ctu.student.regreen.dto.request.MaterialRequest;
import ctu.student.regreen.dto.response.MaterialResponse;
import ctu.student.regreen.mapper.MaterialMapper;
import ctu.student.regreen.model.Material;
import ctu.student.regreen.repository.MaterialRepository;
import ctu.student.regreen.service.interfaces.MaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class MaterialServiceImpl implements MaterialService {

    private final MaterialRepository repository;

    public MaterialResponse create(MaterialRequest request) {
        Material material = MaterialMapper.toEntity(request);
        material = repository.save(material);
        return MaterialMapper.toResponse(material);
    }

    public List<MaterialResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(MaterialMapper::toResponse)
                .toList();
    }

    public MaterialResponse getById(Integer id) {
        Material material = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found with id: " + id));
        return MaterialMapper.toResponse(material);
    }

    public MaterialResponse update(Integer id, MaterialRequest request) {
        Material material = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found with id: " + id));
        MaterialMapper.update(material, request);
        material = repository.save(material);
        return MaterialMapper.toResponse(material);
    }

    public Boolean delete(Integer id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Material not found with id: " + id);
        }
        repository.deleteById(id);
        return true;
    }
}
