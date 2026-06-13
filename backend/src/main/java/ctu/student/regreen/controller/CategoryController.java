package ctu.student.regreen.controller;

import ctu.student.regreen.dto.request.CategoryRequest;
import ctu.student.regreen.dto.response.CategoryResponse;
import ctu.student.regreen.service.interfaces.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService service;

    // [GET] /api/categories
    @GetMapping
    public List<CategoryResponse> getAllCategories() {
        return service.getAll();
    }

    // [GET] /api/categories/{id}
    @GetMapping("/{id}")
    public CategoryResponse getCategoryById(@PathVariable Integer id) {
        return service.getById(id);
    }

    // [POST] /api/categories
    @PostMapping
    public CategoryResponse createCategory(@RequestBody CategoryRequest request) {
        return service.create(request);
    }

    // [PUT] /api/categories/{id}
    @PutMapping("/{id}")
    public CategoryResponse updateCategory(@PathVariable Integer id, @RequestBody CategoryRequest request) {
        return service.update(id, request);
    }

    // [DELETE] /api/categories/{id}
    @DeleteMapping("/{id}")
    public Boolean deleteCategory(@PathVariable Integer id) {
        return service.delete(id);
    }
}
