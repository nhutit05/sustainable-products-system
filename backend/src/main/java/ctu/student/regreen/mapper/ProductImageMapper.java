package ctu.student.regreen.mapper;

import ctu.student.regreen.dto.request.ProductImageRequest;
import ctu.student.regreen.dto.response.ProductImageResponse;
import ctu.student.regreen.model.Product;
import ctu.student.regreen.model.ProductImage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProductImageMapper {

    public ProductImageResponse toResponse(ProductImage entity) {
        return new ProductImageResponse(
                entity.getProductImageId(),
                entity.getImageUrl(),
                entity.getProduct().getProductId()
                );
    }

    public ProductImage toEntity(ProductImageRequest request, Product product) {
        ProductImage productImage = new ProductImage();

        productImage.setImageUrl(request.getImageUrl());
        productImage.setProduct(product);

        return productImage;
    }

    public void update(ProductImage productImage,
                       ProductImageRequest request,
                       Product product) {

        productImage.setImageUrl(request.getImageUrl());

        productImage.setProduct(product);
    }
}
