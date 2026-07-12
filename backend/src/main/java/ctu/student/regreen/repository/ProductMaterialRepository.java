package ctu.student.regreen.repository;

import ctu.student.regreen.model.ProductMaterial;
import ctu.student.regreen.model.ProductMaterialId;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductMaterialRepository extends JpaRepository<ProductMaterial, ProductMaterialId> {

    List<ProductMaterial> findAllByProductProductIdAndMaterialMaterialId(Integer productId, Integer materialId);

    List<ProductMaterial> findAllByProductProductId(Integer productId);

    List<ProductMaterial> findAllByProductProductIdIn(List<Integer> productIds);

    List<ProductMaterial> findAllByMaterialMaterialId(Integer materialId);

    Optional<ProductMaterial> findByProductProductIdAndMaterialMaterialId(Integer productId, Integer materialId);

    Optional<ProductMaterial> deleteByProductProductIdAndMaterialMaterialId(Integer productId, Integer materialId);

    @Modifying
    @Transactional
    @Query("DELETE FROM ProductMaterial pm WHERE pm.product.productId = :productId")
    void deleteByProductId(@Param("productId") Integer productId);
}
