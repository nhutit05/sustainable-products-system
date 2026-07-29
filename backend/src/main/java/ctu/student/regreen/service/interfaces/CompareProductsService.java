package ctu.student.regreen.service.interfaces;

import ctu.student.regreen.dto.response.CompareProductsResponse;
import ctu.student.regreen.dto.response.CompareSection;
import ctu.student.regreen.dto.response.ProductMaterialResponse;
import ctu.student.regreen.dto.response.ProductResponse;
import ctu.student.regreen.model.Product;
import ctu.student.regreen.model.ProductMaterial;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

public interface CompareProductsService {

    CompareProductsResponse compareProducts(List<Integer> productIds);

    CompareSection buildEcoSection(List<Product> products,
                                   List<ProductMaterialResponse> materials);

    // Thong so ky thuat
    CompareSection buildTechnicalSection(List<Product> products);
}
