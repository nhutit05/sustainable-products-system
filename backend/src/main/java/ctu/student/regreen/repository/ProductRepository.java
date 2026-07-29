package ctu.student.regreen.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import ctu.student.regreen.model.Product;
import org.springframework.data.repository.query.Param;

public interface ProductRepository
        extends JpaRepository<Product, Integer>, JpaSpecificationExecutor<Product> {

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.category")
    List<Product> findAllWithCategory();

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.category WHERE p.productId IN :ids")
    List<Product> findAllWithCategoryByIdIn(List<Integer> ids);

     //sản phẩm chi tiết kèm Category cho luồng Gợi Ý
    @Query("SELECT p FROM Product p " +
            "JOIN FETCH p.category " +
            "WHERE p.productId = :id " +
            "AND (p.isDeleted IS NULL OR p.isDeleted = false)")
    Optional<Product> findByIdWithCategory(@Param("id") Integer id);

    // Query các ứng viên gợi ý cùng Category
    @Query("SELECT DISTINCT p FROM Product p " +
            "JOIN FETCH p.category " +
            "WHERE p.category.categoryId = :categoryId " +
            "AND p.productId != :excludeProductId " +
            "AND p.statusSale = true " +
            "AND p.inventory > 0 " +
            "AND (p.isDeleted IS NULL OR p.isDeleted = false)")
    List<Product> findCandidatesForRecommendation(
            @Param("categoryId") Integer categoryId,
            @Param("excludeProductId") Integer excludeProductId
    );
}