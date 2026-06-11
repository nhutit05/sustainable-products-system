package ctu.student.regreen.service;

import ctu.student.regreen.model.ProductImage;
import ctu.student.regreen.repository.ProductImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductImageService {

    @Autowired
    ProductImageRepository repository;

    // [GET] /api/product-images
    public List<ProductImage> getAllProductImages() {
        return repository.findAll();
    }

    // [GET] /api/product-images/{id}
    public ProductImage getProductImageById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    // [GET] /api/product-images/count
    public Integer countProductImages() {
        return (int) repository.count();
    }

    // [POST] /api/product-images
    public ProductImage createProductImage(ProductImage productImage) {
        return repository.save(productImage);
    }

    // [POST] /api/product-images/bulk
    public List<ProductImage> createProductImages(List<ProductImage> productImages) {
        return repository.saveAll(productImages);
    }

    // [PUT] /api/product-images/{id}
    public ProductImage updateProductImage(Integer id, ProductImage productImage) {
        ProductImage existingProductImage = repository.findById(id).orElse(null);
        if (existingProductImage != null) {
            return repository.save(productImage);
        }
        return null;
    }

    // [DELETE] /api/product-images/{id}
    public boolean deleteProductImage(Integer id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    // [DELETE] /api/product-images
    public void deleteAllProductImages() {
        repository.deleteAll();
    }
}
