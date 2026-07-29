package ctu.student.regreen.controller;

import ctu.student.regreen.dto.response.CompareProductsResponse;
import ctu.student.regreen.dto.response.ProductResponse;
import ctu.student.regreen.dto.response.RecommendationResponse;
import ctu.student.regreen.service.interfaces.CompareProductsService;
import ctu.student.regreen.service.interfaces.ProductRecommendationService;
import ctu.student.regreen.service.interfaces.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService service;
    private final CompareProductsService compareProductsService;
    private final ProductRecommendationService productRecommendationService;

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

    // [GET] /api/products/{id}/recommendations?limit=5
    @GetMapping("/{id}/recommendations")
    public ResponseEntity<RecommendationResponse> getRecommendations(
            @PathVariable("id") Integer productId,
            @RequestParam(defaultValue = "6") int limit) {
        return ResponseEntity.ok(productRecommendationService.getRecommendations(productId, limit));
    }

    @GetMapping("/count")
    public Integer countProducts() {
         return service.countProducts();
    }

    // [GET] /api/products/compare?productIds=1,2,3
    @GetMapping("/compare")
    public CompareProductsResponse compareProducts(@RequestParam List<Integer> productIds) {
        return compareProductsService.compareProducts(productIds);
    }
}