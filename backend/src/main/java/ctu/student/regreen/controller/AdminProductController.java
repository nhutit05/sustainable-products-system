package ctu.student.regreen.controller;

import ctu.student.regreen.dto.request.ProductRequest;
import ctu.student.regreen.dto.response.ProductResponse;
import ctu.student.regreen.service.interfaces.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductService service;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProductResponse create(
            @RequestPart("request") ProductRequest request,
            @RequestPart(value="images", required = false)List<MultipartFile> images
    ) {
        request.setImagesFiles(images == null ? Collections.emptyList() : images);
        return service.create(request);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProductResponse update(
            @PathVariable Integer id,
            @RequestPart("request") ProductRequest request,
            @RequestPart(value = "images", required = false)List<MultipartFile> images) {
        request.setImagesFiles(images == null ? Collections.emptyList() : images);
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public Boolean delete(@PathVariable Integer id) {
        return service.delete(id);
    }

    @GetMapping
    public List<ProductResponse> getAll(
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "limit", required = false) Integer limit
    ) {
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
}