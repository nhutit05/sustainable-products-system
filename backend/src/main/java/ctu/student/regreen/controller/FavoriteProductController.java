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

    // [GET] /api/favorite-products
    @GetMapping
    public List<FavoriteProductResponse> getAll() {
        return service.getAll();
    }

    // [GET] /api/favorite-products?userId={userId}
    @GetMapping(params = "userId")
    public List<FavoriteProductResponse> getAllByUserId(
            @RequestParam Integer userId) {
        return service.getAllByUserId(userId);
    }

    // [GET] /api/favorite-products?productId={productId}
    @GetMapping(params = "productId")
    public List<FavoriteProductResponse> getAllByProductId(
            @RequestParam Integer productId) {
        return service.getAllByProductId(productId);
    }

    // [GET] /api/favorite-products?userId={userId}&productId={productId}
    @GetMapping(params = {"userId", "productId"})
    public FavoriteProductResponse getByUserIdAndProductId(
            @RequestParam Integer userId,
            @RequestParam Integer productId) {
        return service.getByUserIdAndProductId(userId, productId);
    }

    // [POST] /api/favorite-products
    @PostMapping
    public FavoriteProductResponse create(
            @RequestBody FavoriteProductRequest request) {
        return service.create(request);
    }

    // [PUT] /api/favorite-products?userId={userId}&productId={productId}
    @PutMapping(params = {"userId", "productId"})
    public FavoriteProductResponse update(
            @RequestParam Integer userId,
            @RequestParam Integer productId,
            @RequestBody FavoriteProductRequest request) {
        return service.update(userId, productId, request);
    }

    // [DELETE] /api/favorite-products?userId={userId}&productId={productId}
    @DeleteMapping(params = {"userId", "productId"})
    public Boolean delete(
            @RequestParam Integer userId,
            @RequestParam Integer productId) {
        return service.delete(userId, productId);
    }

}
