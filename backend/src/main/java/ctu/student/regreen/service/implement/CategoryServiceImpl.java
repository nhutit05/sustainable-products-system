package ctu.student.regreen.service.implement;

import ctu.student.regreen.dto.request.CategoryRequest;
import ctu.student.regreen.dto.response.CategoryResponse;
import ctu.student.regreen.mapper.CategoryMapper;
import ctu.student.regreen.model.Category;
import ctu.student.regreen.repository.CategoryRepository;
import ctu.student.regreen.service.interfaces.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository repository;

    public List<CategoryResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(CategoryMapper::toResponse)
                .toList();
    }

    public CategoryResponse getById(Integer id) {
        return repository.findById(id)
                .map(CategoryMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }

    public CategoryResponse create(CategoryRequest request) {
        Category category = CategoryMapper.toEntity(request);
        return CategoryMapper.toResponse(repository.save(category));
    }

    public CategoryResponse update(Integer id, CategoryRequest request) {
        Category category = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        CategoryMapper.update(category, request);
        return CategoryMapper.toResponse(repository.save(category));
    }

    public Boolean delete(Integer id) {
        Category category = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        repository.delete(category);
        return true;
    }
}
