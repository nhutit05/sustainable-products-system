package ctu.student.regreen.repository;

import ctu.student.regreen.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByCustomerUserIdAndProductProductId(
            Integer userId,
            Integer productId
    );

    List<Review> findByProductProductId(Integer productId);
    List<Review> findByCustomerUserId(Integer userId);
    List<Review> findByReviewRating(Integer reviewRating);
}
