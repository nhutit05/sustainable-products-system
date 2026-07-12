package ctu.student.regreen.controller;

import ctu.student.regreen.dto.response.ProductResponse;
import ctu.student.regreen.service.interfaces.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService service;

    @GetMapping
    public List<ProductResponse> getAll(
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "limit", required = false) Integer limit) {

        List<ProductResponse> allProducts = service.getAll();

        // Nếu Admin không truyền page hoặc limit -> Trả về toàn bộ danh sách luôn
        if (page == null || limit == null || limit <= 0 || page < 1) {
            return allProducts;
        }

        // Logic tính toán phân trang trên List (Sublist)
        int totalItems = allProducts.size();
        int fromIndex = (page - 1) * limit;
        int toIndex = Math.min(fromIndex + limit, totalItems);

        // Trường hợp vị trí bắt đầu vượt quá tổng số sản phẩm
        if (fromIndex > totalItems) {
            return Collections.emptyList();
        }

        return allProducts.subList(fromIndex, toIndex);
    }

    @GetMapping("/{id}")
    public ProductResponse getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @GetMapping("/count")
    public Integer countProducts() {
         return service.countProducts();
    }
}