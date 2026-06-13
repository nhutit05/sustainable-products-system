package ctu.student.regreen.service.interfaces;


import ctu.student.regreen.dto.request.CategoryRequest;
import ctu.student.regreen.dto.response.CategoryResponse;

import java.util.List;

public interface CategoryService {
    List<CategoryResponse> getAll();
    CategoryResponse getById(Integer id);
    CategoryResponse create(CategoryRequest request);
    CategoryResponse update(Integer id, CategoryRequest request);
    Boolean delete(Integer id);
}
