package ctu.student.regreen.repository;

import ctu.student.regreen.model.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Integer> {

    List<ProductImage> findAllByProductProductId(Integer productId);

    Optional<ProductImage> findByProductImageIdAndProductProductId(Integer productImageId, Integer productId);

    Optional<ProductImage> deleteByProductImageIdAndProductProductId(Integer productImageId, Integer productId);
}
