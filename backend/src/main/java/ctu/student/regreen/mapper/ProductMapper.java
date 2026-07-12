package ctu.student.regreen.mapper;

import ctu.student.regreen.dto.response.ProductMaterialResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import ctu.student.regreen.dto.request.ProductRequest;
import ctu.student.regreen.dto.response.ProductResponse;
import ctu.student.regreen.model.Category;
import ctu.student.regreen.model.Product;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ProductMapper {

    private final ProductMaterialMapper productMaterialMapper;

    public Product toEntity(
            ProductRequest request,
            Category category
    ) {

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
        product.setIsDeleted(request.getIsDelete() != null ? request.getIsDelete() : false);

        product.setCategory(category);

        return product;
    }

    public void update(
            ProductRequest request,
            Product product,
            Category category) {

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
    }

    public ProductResponse toResponse(
            Product product,
            List<ProductMaterialResponse> materials,
            List<String> imageResponses) {

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
                materials,
                imageResponses
        );

    }
}