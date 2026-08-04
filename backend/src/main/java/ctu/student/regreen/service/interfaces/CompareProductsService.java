package ctu.student.regreen.service.interfaces;

import ctu.student.regreen.dto.response.CompareProductsResponse;
import ctu.student.regreen.dto.response.CompareSection;
import ctu.student.regreen.dto.response.ProductMaterialResponse;
import ctu.student.regreen.model.Product;
import java.util.List;

public interface CompareProductsService {

    CompareProductsResponse compareProducts(List<Integer> productIds);

    CompareSection buildEcoSection(List<Product> products,
                                   List<ProductMaterialResponse> materials);

    // Thong so ky thuat
    CompareSection buildTechnicalSection(List<Product> products);
}
