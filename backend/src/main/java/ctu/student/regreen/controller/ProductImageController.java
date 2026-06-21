package ctu.student.regreen.controller;

import ctu.student.regreen.dto.request.ProductImageRequest;
import ctu.student.regreen.dto.response.ProductImageResponse;
import ctu.student.regreen.service.interfaces.ProductImageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.awt.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
public class ProductImageController {

    private final ProductImageService service;

    // [GET] /api/products/{productId}/images
    @GetMapping("/products/{productId}/images")
    public List<ProductImageResponse> getAllByProductId(@PathVariable Integer productId) {
        return service.getAllProductImagesByProductId(productId);
    }

    // [GET] /api/products/{productId}/images/{productImageId}
    @GetMapping("/products/{productId}/images/{productImageId}")
    public ProductImageResponse getByProductImageIdAndProductId(
            @PathVariable Integer productImageId,
            @PathVariable Integer productId) {
        return service.getByProductImageIdAndProductId(productImageId, productId);
    }

    // [POST] /api/products/{productId}/images
    @PostMapping(
            value = "/products/{productId}/images",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProductImageResponse createProductImage(
            @PathVariable Integer productId,
            @RequestParam("image")MultipartFile image) {
        return service.createProductImage(productId, image);
    }

    // [PUT] /api/products/{productId}/images/{productImageId}
    @PutMapping("/products/{productId}/images/{productImageId}")
    public ProductImageResponse updateProductImage(
            @PathVariable Integer productImageId,
            @PathVariable Integer productId,
            @RequestParam ("image")MultipartFile image) {
        return service.updateProductImage(productImageId, productId, image);
    }

    // [DELETE] /api/products/{productId}/images/{productImageId}
    @DeleteMapping("/products/{productId}/images/{productImageId}")
    public Boolean deleteByProductImageIdAndProductId(
            @PathVariable Integer productImageId,
            @PathVariable Integer productId) {
        return service.deleteByProductImageIdAndProductId(productImageId, productId);
    }

}

