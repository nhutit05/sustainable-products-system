package ctu.student.regreen.service.interfaces;

import ctu.student.regreen.dto.request.ProductMaterialRequest;
import ctu.student.regreen.dto.response.ProductMaterialResponse;
import java.util.List;

public interface ProductMaterialService {

    List<ProductMaterialResponse> getAll();

    List<ProductMaterialResponse> getAllByProductId(Integer productId);

    List<ProductMaterialResponse> getAllByMaterialId(Integer materialId);

    ProductMaterialResponse getByProductIdAndMaterialId(Integer productId, Integer materialId);

    ProductMaterialResponse create(ProductMaterialRequest request);

    ProductMaterialResponse update(Integer productId, Integer materialId, ProductMaterialRequest request);

    Boolean deleteByProductIdAndMaterialId(Integer productId, Integer materialId);
}
