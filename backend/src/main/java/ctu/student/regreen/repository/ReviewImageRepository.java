package ctu.student.regreen.repository;

import ctu.student.regreen.model.Review;
import ctu.student.regreen.model.ReviewImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewImageRepository extends JpaRepository<ReviewImage, Integer> {

    Optional<ReviewImage> findByReviewReviewIdAndReviewImageId(Integer reviewId, Integer id);

    Optional<ReviewImage> findByReviewImageId(Integer id);

    Optional<ReviewImage> deleteByReviewReviewIdAndReviewImageId(Integer reviewId, Integer id);

    List<ReviewImage> findByReviewReviewId(Integer id);
}
