package ctu.student.regreen.service.implement;

import ctu.student.regreen.dto.request.ReviewRequest;
import ctu.student.regreen.dto.response.ReviewResponse;
import ctu.student.regreen.mapper.ReviewMapper;
import ctu.student.regreen.model.Review;
import ctu.student.regreen.repository.ReviewRepository;
import ctu.student.regreen.service.interfaces.ReviewService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository repository;
    private final ReviewMapper mapper;

    public List<ReviewResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    public List<ReviewResponse> getAllByCustomerAndProduct(
            Integer customerId,
            Integer productId) {

        return repository
                .findByCustomerUserIdAndProductProductId(
                        customerId,
                        productId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    public List<ReviewResponse> getAllByProductId(Integer productId) {
        return repository.findByProductProductId(productId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    public List<ReviewResponse> getAllByCustomerId(Integer customerId) {
        return repository.findByCustomerUserId(customerId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    public List<ReviewResponse> getAllByRating(Integer rating) {
        return repository.findByReviewRating(rating)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    public ReviewResponse getById(Integer reviewId) {
        Review review = repository.findById(reviewId)
                .orElseThrow(() ->
                        new RuntimeException("Review not found"));
        return mapper.toResponse(review);
    }

    public ReviewResponse create(ReviewRequest request) {
        Review review = mapper.toEntity(request);
        return mapper.toResponse(repository.save(review));
    }

    public ReviewResponse update(Integer reviewId, ReviewRequest request) {
        Review review = repository.findById(reviewId)
                .orElseThrow(() ->
                        new RuntimeException("Review not found"));

        mapper.update(review, request);

        return mapper.toResponse(repository.save(review));
    }

    public Boolean delete(Integer id) {
        Review review = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Review not found"));
        repository.delete(review);
        return true;
    }
}
