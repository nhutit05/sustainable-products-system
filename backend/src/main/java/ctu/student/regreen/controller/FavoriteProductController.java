package ctu.student.regreen.controller;

import ctu.student.regreen.dto.request.FavoriteProductRequest;
import ctu.student.regreen.dto.response.FavoriteProductResponse;
import ctu.student.regreen.service.interfaces.FavoriteProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorite-products")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
public class FavoriteProductController {

    private final FavoriteProductService service;

    // [GET] /api/favorite-products?userId={userId}
    @GetMapping
    public List<FavoriteProductResponse> getAllByUserId() {
        return service.getAllByUserId();
    }

    // [GET] /api/favorite-products?userId={userId}&productId={productId}
    @GetMapping("product/{productId}")
    public FavoriteProductResponse getByUserIdAndProductId(
            @PathVariable Integer productId) {
        return service.getByUserIdAndProductId(productId);
    }

    // [POST] /api/favorite-products
    @PostMapping
    public FavoriteProductResponse create(
            @RequestBody FavoriteProductRequest request) {
        return service.create(request);
    }

    // [DELETE] /api/favorite-products?userId={userId}&productId={productId}
    @DeleteMapping("product/{productId}")
    public Boolean delete(
            @PathVariable Integer productId) {
        return service.delete(productId);
    }

}
