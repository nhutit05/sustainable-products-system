package ctu.student.regreen.service.implement;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ctu.student.regreen.dto.request.CategoryRequest;
import ctu.student.regreen.dto.response.CategoryResponse;
import ctu.student.regreen.mapper.CategoryMapper;
import ctu.student.regreen.model.Category;
import ctu.student.regreen.repository.CategoryRepository;
import ctu.student.regreen.service.interfaces.CategoryService;
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
    public List<CategoryResponse> getTree() {
        List<Category> all = repository.findAll();
        return buildTreeFlat(all, null, 0);
    }

    private List<CategoryResponse> buildTreeFlat(List<Category> all, Integer parentId, int depth) {
        List<Category> children = all.stream()
                .filter(c -> Objects.equals(
                        c.getParent() != null ? c.getParent().getCategoryId() : null,
                        parentId))
                .sorted(Comparator.comparing(Category::getCategoryName))
                .toList();

        List<CategoryResponse> result = new ArrayList<>();
        for (Category child : children) {
            CategoryResponse resp = mapper.toResponse(child);
            resp.setDepth(depth);
            result.add(resp);
            result.addAll(buildTreeFlat(all, child.getCategoryId(), depth + 1));
        }
        return result;
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

        if (repository.existsByCategoryName(request.getCategoryName())) {
            throw new RuntimeException("Tên danh mục đã tồn tại");
        }

        Category category = mapper.toEntity(request);

        if (request.getParentId() != null) {
            Category parent = repository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Danh mục cha không tồn tại"));
            if (parent.getParent() != null) {
                throw new RuntimeException("Chỉ được tạo danh mục con cấp 1");
            }
            category.setParent(parent);
        }

        return mapper.toResponse(repository.save(category));
    }

    @Override
    @Transactional
    public CategoryResponse update(Integer id, CategoryRequest request) {

        Category category = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Category not found with id: " + id));

        if (repository.existsByCategoryNameAndCategoryIdNot(request.getCategoryName(), id)) {
            throw new RuntimeException("Tên danh mục đã tồn tại");
        }

        if (request.getParentId() != null && request.getParentId().equals(id)) {
            throw new RuntimeException("Danh mục không thể là chính nó");
        }

        mapper.update(category, request);

        if (request.getParentId() != null) {
            Category parent = repository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Danh mục cha không tồn tại"));
            if (parent.getParent() != null) {
                throw new RuntimeException("Chỉ được tạo danh mục con cấp 1");
            }
            category.setParent(parent);
        } else {
            category.setParent(null);
        }

        return mapper.toResponse(repository.save(category));
    }

    @Override
    @Transactional
    public void delete(Integer id) {

        Category category = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Category not found with id: " + id));

        List<Category> children = repository.findByParentCategoryId(id);
        if (!children.isEmpty()) {
            throw new RuntimeException("Không thể xóa danh mục có danh mục con");
        }

        repository.delete(category);
    }

    @Override
    public List<Integer> getDescendantIds(Integer categoryId) {
        List<Integer> ids = new ArrayList<>();
        ids.add(categoryId);
        List<Category> all = repository.findAll();
        collectDescendants(all, categoryId, ids);
        return ids;
    }

    private void collectDescendants(List<Category> all, Integer parentId, List<Integer> ids) {
        all.stream()
                .filter(c -> c.getParent() != null
                        && c.getParent().getCategoryId().equals(parentId))
                .forEach(c -> {
                    ids.add(c.getCategoryId());
                    collectDescendants(all, c.getCategoryId(), ids);
                });
    }
}