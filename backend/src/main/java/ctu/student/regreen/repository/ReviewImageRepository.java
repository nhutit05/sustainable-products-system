package ctu.student.regreen.repository;

import ctu.student.regreen.model.ReviewImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewImageRepository extends JpaRepository<ReviewImage, Integer> {

    Optional<ReviewImage> findByReviewImageId(Integer id);
}
