package ctu.student.regreen.controller;

import ctu.student.regreen.dto.request.ProductMaterialRequest;
import ctu.student.regreen.dto.response.ProductMaterialResponse;
import ctu.student.regreen.service.interfaces.ProductMaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-materials")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
public class ProductMaterialController {

    private final ProductMaterialService service;

    // [GET] /api/product-materials
    @GetMapping
    public List<ProductMaterialResponse> getAll() {
        return service.getAll();
    }

    // [GET] /api/product-materials?productId={productId}
    @GetMapping(params = "productId")
    public List<ProductMaterialResponse> getAllByProductId(@RequestParam Integer productId) {
        return service.getAllByProductId(productId);
    }

    // [GET] /api/product-materials?materialId={materialId}
    @GetMapping(params = "materialId")
    public List<ProductMaterialResponse> getAllByMaterialId(@RequestParam Integer materialId) {
        return service.getAllByMaterialId(materialId);
    }

    // [GET] /api/product-materials?productId={productId}&materialId={materialId}
    @GetMapping(params = {"productId", "materialId"})
    public ProductMaterialResponse getByProductIdAndMaterialId(
            @RequestParam Integer productId,
            @RequestParam Integer materialId) {
        return service.getByProductIdAndMaterialId(productId, materialId);
    }

    // [POST] /api/product-materials
    @PostMapping
    public ProductMaterialResponse create(@RequestBody ProductMaterialRequest request) {
        return service.create(request);
    }

    // [PUT] /api/product-materials?productId={productId}&materialId={materialId}
    @PutMapping(params = {"productId", "materialId"})
    public ProductMaterialResponse update(
            @RequestParam Integer productId,
            @RequestParam Integer materialId,
            @RequestBody ProductMaterialRequest request) {

        return service.update(productId, materialId, request);
    }

    // [DELETE] /api/product-materials?productId={productId}&materialId={materialId}
    @DeleteMapping(params = {"productId", "materialId"})
    public void deleteByProductIdAndMaterialId(
            @RequestParam Integer productId,
            @RequestParam Integer materialId) {
        service.deleteByProductIdAndMaterialId(productId, materialId);
    }
}
