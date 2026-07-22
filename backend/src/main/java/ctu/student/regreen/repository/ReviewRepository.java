package ctu.student.regreen.repository;

import ctu.student.regreen.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByCustomerUserIdAndProductProductId(
            Integer userId,
            Integer productId
    );

    @EntityGraph(attributePaths = {"customer", "product"})
    List<Review> findByProductProductId(Integer productId);

    @EntityGraph(attributePaths = {"customer", "product"})
    List<Review> findByProductProductIdAndIsHiddenFalse(Integer productId);

    @EntityGraph(attributePaths = {"customer", "product"})
    List<Review> findByIsHiddenFalse();

    @EntityGraph(attributePaths = {"customer", "product"})
    List<Review> findAll();

    @EntityGraph(attributePaths = {"customer", "product"})
    @Query("SELECT r FROM Review r WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR LOWER(r.reviewContent) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(r.customer.username) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Review> findAllPaginated(@Param("keyword") String keyword, Pageable pageable);

    List<Review> findByCustomerUserId(Integer userId);
    List<Review> findByReviewRating(Integer reviewRating);
}
