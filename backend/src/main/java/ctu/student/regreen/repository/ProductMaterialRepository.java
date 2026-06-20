package ctu.student.regreen.repository;

import ctu.student.regreen.model.ProductMaterial;
import ctu.student.regreen.model.ProductMaterialId;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProductMaterialRepository extends JpaRepository<ProductMaterial, ProductMaterialId> {

    List<ProductMaterial> findAllByProductProductIdAndMaterialMaterialId(Integer productId, Integer materialId);

    List<ProductMaterial> findAllByProductProductId(Integer productId);

    List<ProductMaterial> findAllByMaterialMaterialId(Integer materialId);

    Optional<ProductMaterial> findByProductProductIdAndMaterialMaterialId(Integer productId, Integer materialId);

    Optional<ProductMaterial> deleteByProductProductIdAndMaterialMaterialId(Integer productId, Integer materialId);

}
