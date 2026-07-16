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
import java.util.Map;

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
    public Map<String, Object> getAll(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "categoryId", required = false) Integer categoryId,
            @RequestParam(value = "statusSale", required = false) Boolean statusSale,
            @RequestParam(value = "page", required = false, defaultValue = "1") Integer page,
            @RequestParam(value = "limit", required = false, defaultValue = "10") Integer limit
    ) {
        return service.getAllFiltered(keyword, categoryId, statusSale, page, limit);
    }

    @GetMapping("/{id}")
    public ProductResponse getById(@PathVariable Integer id) {
        return service.getById(id);
    }
}