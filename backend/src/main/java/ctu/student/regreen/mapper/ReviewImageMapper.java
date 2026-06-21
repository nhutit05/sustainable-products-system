package ctu.student.regreen.mapper;

import ctu.student.regreen.dto.request.ReviewImageRequest;
import ctu.student.regreen.dto.response.ReviewImageResponse;
import ctu.student.regreen.model.Review;
import ctu.student.regreen.model.ReviewImage;
import ctu.student.regreen.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ReviewImageMapper {
    private final ReviewRepository repository;
    private final ReviewMapper reviewMapper;

    public ReviewImage toEntity(Review review, ReviewImageRequest request) {
        ReviewImage entity = new ReviewImage();
        entity.setReviewImageUrl(request.getReviewImageUrl());
        entity.setReview(review);

        return entity;
    }

    public ReviewImageResponse toResponse(ReviewImage entity) {
        return new ReviewImageResponse(
                entity.getReviewImageId(),
                entity.getReviewImageUrl(),
                reviewMapper.toResponse(entity.getReview())
        );
    }

    public void update(Integer reviewId,
                       ReviewImage entity,
                       ReviewImageRequest request) {
        entity.setReviewImageUrl(request.getReviewImageUrl());
        Review review = repository.findById(reviewId)
                .orElseThrow(() ->
                        new RuntimeException("Review not found with id: " + reviewId));
        entity.setReview(review);
    }
}
