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

    public ReviewImage toEntity(ReviewImageRequest request) {

        Review review = repository.findById(request.getReviewId())
                .orElseThrow(() ->
                        new RuntimeException("Review not found with id: " + request.getReviewId()));

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

    public void update(ReviewImage entity, ReviewImageRequest request) {
        entity.setReviewImageUrl(request.getReviewImageUrl());
        Review review = repository.findById(request.getReviewId())
                .orElseThrow(() ->
                        new RuntimeException("Review not found with id: " + request.getReviewId()));
        entity.setReview(review);

    }
}
