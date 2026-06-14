package ctu.student.regreen.service.interfaces;

import ctu.student.regreen.dto.request.ProductImageRequest;
import ctu.student.regreen.dto.response.ProductImageResponse;
import ctu.student.regreen.model.ProductImage;

import java.util.List;

public interface ProductImageService {
    List<ProductImageResponse> getAllProductImagesByProductId(Integer productId);

    ProductImageResponse getByProductImageIdAndProductId(Integer productImageId, Integer productId);
    ProductImageResponse updateProductImage(Integer productImageId, Integer productId, ProductImageRequest request);
    ProductImageResponse createProductImage(ProductImageRequest request);

    Boolean deleteByProductImageIdAndProductId(Integer productImageId, Integer productId);
}
