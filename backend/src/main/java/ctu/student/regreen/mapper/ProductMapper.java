package ctu.student.regreen.mapper;

import org.springframework.stereotype.Component;

import ctu.student.regreen.dto.request.ProductRequest;
import ctu.student.regreen.dto.response.ProductResponse;
import ctu.student.regreen.model.Category;
import ctu.student.regreen.model.File;
import ctu.student.regreen.model.Product;

@Component
public class ProductMapper {

    public Product toEntity(
            ProductRequest request,
            Category category,
            File file) {

        Product product = new Product();

        product.setProductName(request.getProductName());
        product.setProductPrice(request.getProductPrice());
        product.setProductCarbonIndex(request.getProductCarbonIndex());
        product.setBaseEcoPoints(request.getBaseEcoPoints());
        product.setInventory(request.getInventory());
        product.setOriginal(request.getOriginal());
        product.setStatusSale(request.getStatusSale());
        product.setExpiredAt(request.getExpiredAt());
        product.setWeight(request.getWeight());

        product.setCategory(category);
        product.setFile(file);

        return product;
    }

    public void update(
            Product product,
            ProductRequest request,
            Category category,
            File file) {

        product.setProductName(request.getProductName());
        product.setProductPrice(request.getProductPrice());
        product.setProductCarbonIndex(request.getProductCarbonIndex());
        product.setBaseEcoPoints(request.getBaseEcoPoints());
        product.setInventory(request.getInventory());
        product.setOriginal(request.getOriginal());
        product.setStatusSale(request.getStatusSale());
        product.setExpiredAt(request.getExpiredAt());
        product.setWeight(request.getWeight());

        product.setCategory(category);
        product.setFile(file);
    }

    public ProductResponse toResponse(Product product) {

        return new ProductResponse(
                product.getProductId(),
                product.getProductName(),
                product.getProductPrice(),
                product.getProductCarbonIndex(),
                product.getBaseEcoPoints(),
                product.getInventory(),
                product.getOriginal(),
                product.getStatusSale(),
                product.getExpiredAt(),
                product.getWeight(),
                product.getCategory().getCategoryId(),
                product.getCategory().getCategoryName(),
                product.getFile().getFileId()
        );
    }
}