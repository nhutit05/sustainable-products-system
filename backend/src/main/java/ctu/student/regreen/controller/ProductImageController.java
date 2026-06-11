package ctu.student.regreen.controller;

import ctu.student.regreen.model.ProductImage;
import ctu.student.regreen.service.ProductImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-images")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ProductImageController {

    @Autowired
    ProductImageService service;

    // [GET] /api/product-images
    @GetMapping
    public List<ProductImage> getAllProductImages() {
        return service.getAllProductImages();
    }

    // [GET] /api/product-images/{id}
    @GetMapping("/{id}")
    public ProductImage getProductImageById(Integer id) {
        return service.getProductImageById(id);
    }

    // [GET] /api/product-images/count
    @GetMapping("/count")
    public Integer countProductImages() {
        return service.countProductImages();
    }

    // [POST] /api/product-images
    @PostMapping
    public ProductImage createProductImage(@RequestBody ProductImage productImage) {
        return service.createProductImage(productImage);
    }

    // [POST] /api/product-images/bulk
    @PostMapping("/bulk")
    public List<ProductImage> createProductImages(@RequestBody List<ProductImage> productImages){
        return service.createProductImages(productImages);
    }

    // [PUT] /api/product-images/{id}
    @PutMapping("/{id}")
    public ProductImage updateProductImage(@PathVariable Integer id, @RequestBody ProductImage productImage) {
        return service.updateProductImage(id, productImage);
    }

    // [DELETE] /api/product-images/{id}
    @DeleteMapping("/{id}")
    public boolean deleteProductImage(@PathVariable Integer id) {
        return service.deleteProductImage(id);
    }

    // [DELETE] /api/product-images
    @DeleteMapping
    public void deleteAllProductImages() {
        service.deleteAllProductImages();
    }
}

