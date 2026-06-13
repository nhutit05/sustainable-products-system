package ctu.student.regreen.mapper;

import ctu.student.regreen.dto.request.CategoryRequest;
import ctu.student.regreen.dto.response.CategoryResponse;
import ctu.student.regreen.model.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public static Category toEntity(CategoryRequest request) {
        Category category = new Category();
        category.setCategoryName(request.getCategoryName());
        return category;
    }

    public static void update(Category category, CategoryRequest request) {
        category.setCategoryName(request.getCategoryName());
    }

    public static CategoryResponse toResponse(Category category) {
        return new CategoryResponse(
                category.getCategoryId(),
                category.getCategoryName()
        );
    }
}
