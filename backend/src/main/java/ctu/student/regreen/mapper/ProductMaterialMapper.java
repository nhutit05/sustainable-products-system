package ctu.student.regreen.mapper;

import ctu.student.regreen.dto.request.ProductMaterialRequest;
import ctu.student.regreen.dto.response.ProductMaterialResponse;
import ctu.student.regreen.model.Material;
import ctu.student.regreen.model.Product;
import ctu.student.regreen.model.ProductMaterial;
import ctu.student.regreen.model.ProductMaterialId;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProductMaterialMapper {

    public ProductMaterial toEntity(ProductMaterialRequest request, Product product, Material material) {
        ProductMaterial entity = new ProductMaterial();

        ProductMaterialId id = new ProductMaterialId();
        id.setProductId(product.getProductId());
        id.setMaterialId(material.getMaterialId());
        entity.setId(id);

        entity.setProduct(product);
        entity.setMaterial(material);

        entity.setPercentage(request.getPercentage());

        return entity;
    }

    public ProductMaterialResponse toResponse(ProductMaterial productMaterial) {
        return new ProductMaterialResponse(
                productMaterial.getProduct().getProductId(),
                productMaterial.getMaterial().getMaterialId(),
                productMaterial.getPercentage()
        );
    }

    public void update(ProductMaterial productMaterial,
                       ProductMaterialRequest request,
                       Product product,
                       Material material) {

        productMaterial.setProduct(product);
        productMaterial.setMaterial(material);

        productMaterial.setPercentage(request.getPercentage());
    }
}
