package ctu.student.regreen.service.implement;

import ctu.student.regreen.dto.request.MaterialRequest;
import ctu.student.regreen.dto.response.MaterialResponse;
import ctu.student.regreen.mapper.MaterialMapper;
import ctu.student.regreen.model.Material;
import ctu.student.regreen.repository.MaterialRepository;
import ctu.student.regreen.service.interfaces.MaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MaterialServiceImpl implements MaterialService {

    private final MaterialRepository repository;
    private final MaterialMapper mapper;

    @Override
    @Transactional
    public MaterialResponse create(MaterialRequest request) {

        Material material = mapper.toEntity(request);

        return mapper.toResponse(repository.save(material));
    }

    @Override
    public List<MaterialResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public MaterialResponse getById(Integer id) {

        Material material = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found with id: " + id));

        return mapper.toResponse(material);
    }

    @Override
    @Transactional
    public MaterialResponse update(Integer id, MaterialRequest request) {

        Material material = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found with id: " + id));

        mapper.update(material, request);

        return mapper.toResponse(material);
    }

    @Override
    @Transactional
    public void delete(Integer id) {

        Material material = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found with id: " + id));

        repository.delete(material);
    }
}