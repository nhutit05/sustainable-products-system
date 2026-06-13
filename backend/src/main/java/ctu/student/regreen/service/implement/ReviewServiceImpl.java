package ctu.student.regreen.service.implement;

import ctu.student.regreen.dto.request.ReviewRequest;
import ctu.student.regreen.dto.response.ReviewResponse;
import ctu.student.regreen.mapper.ReviewMapper;
import ctu.student.regreen.repository.ReviewRepository;
import ctu.student.regreen.service.interfaces.ReviewService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository repository;

    public List<ReviewResponse> getAll() {
        List<ReviewResponse> reviewResponses = null;
        return reviewResponses;
    }

    public List<ReviewResponse> getAllByCustomerAndProduct(Integer customerId, Integer productId) {
        List<ReviewResponse> reviewResponses = null;
        return reviewResponses;
    }

    public List<ReviewResponse> geAllByProductId(Integer productId) {
        List<ReviewResponse> reviewResponses = null;
        return reviewResponses;
    }

    public List<ReviewResponse> getAllByCustomerId(Integer customerId) {
        List<ReviewResponse> reviewResponses = null;
        return reviewResponses;
    }

    public List<ReviewResponse> getAllByRating(Integer rating) {
        List<ReviewResponse> reviewResponses = null;
        return reviewResponses;
    }

    public ReviewResponse getById(Integer reviewId) {
        ReviewResponse reviewResponse = null;
        return reviewResponse;
    }

    public ReviewResponse create(ReviewRequest request) {
        ReviewResponse reviewResponse = null;
        return reviewResponse;
    }

    public ReviewResponse update(Integer reviewId, ReviewRequest request) {
        ReviewResponse reviewResponse = null;
        return reviewResponse;
    }

    public Boolean delete(Integer id) {
        return false;
    }
}
