package ctu.student.regreen.service.implement;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ctu.student.regreen.dto.request.CategoryRequest;
import ctu.student.regreen.dto.response.CategoryResponse;
import ctu.student.regreen.mapper.CategoryMapper;
import ctu.student.regreen.model.Category;
import ctu.student.regreen.repository.CategoryRepository;
import ctu.student.regreen.service.interfaces.CategoryService;
// import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository repository;
    private final CategoryMapper mapper;

    @Override
    public List<CategoryResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public CategoryResponse getById(Integer id) {
        Category category = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Category not found with id: " + id));

        return mapper.toResponse(category);
    }

    @Override
    @Transactional
    public CategoryResponse create(CategoryRequest request) {

        Category category = mapper.toEntity(request);

        return mapper.toResponse(repository.save(category));
    }

    @Override
    @Transactional
    public CategoryResponse update(Integer id, CategoryRequest request) {

        Category category = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Category not found with id: " + id));

        mapper.update(category, request);

        return mapper.toResponse(repository.save(category));
    }

    @Override
    @Transactional
    public void delete(Integer id) {

        Category category = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Category not found with id: " + id));

        repository.delete(category);
    }
}