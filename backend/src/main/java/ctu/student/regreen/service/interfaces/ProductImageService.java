package ctu.student.regreen.service.interfaces;

import ctu.student.regreen.dto.request.ProductImageRequest;
import ctu.student.regreen.dto.response.ProductImageResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductImageService {
    List<ProductImageResponse> getAllProductImagesByProductId(Integer productId);

    ProductImageResponse getByProductImageIdAndProductId(Integer productImageId, Integer productId);
    ProductImageResponse updateProductImage(Integer productImageId,
                                            Integer productId,
                                            MultipartFile image);
    ProductImageResponse createProductImage(Integer productId, MultipartFile image);

    Boolean deleteByProductImageIdAndProductId(Integer productImageId, Integer productId);
}
