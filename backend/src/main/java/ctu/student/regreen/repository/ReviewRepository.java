package ctu.student.regreen.repository;

import ctu.student.regreen.dto.response.ReviewResponse;
import ctu.student.regreen.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByCustomerUserIdAndProductProductId(
            Integer userId,
            Integer productId
    );

    List<Review> findByProductProductId(Integer productId);
    List<Review> findByCustomerUserId(Integer userId);
    List<Review> findByReviewRating(Integer reviewRating);
}
