package ctu.student.regreen.service.interfaces;

import ctu.student.regreen.dto.request.ReviewRequest;
import ctu.student.regreen.dto.response.ReviewResponse;

import java.util.List;

public interface ReviewService {
    List<ReviewResponse> getAll();
//    List<ReviewResponse> getAllByCustomerAndProduct(Integer customerId, Integer productId);

    List<ReviewResponse> getAllByProductId(Integer productId);

//    Integer getCountByProductId(Integer productId);

//    List<ReviewResponse> getAllByCustomerId(Integer customerId);
//    List<ReviewResponse> getAllByRating(Integer rating);
    ReviewResponse getById(Integer reviewId);

    ReviewResponse create(ReviewRequest request,Integer productId);
    ReviewResponse update(Integer reviewId, ReviewRequest request);

    Boolean delete(Integer id);
}
