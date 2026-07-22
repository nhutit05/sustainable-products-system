package ctu.student.regreen.service.interfaces;

import ctu.student.regreen.dto.request.ReviewRequest;
import ctu.student.regreen.dto.response.PageResponse;
import ctu.student.regreen.dto.response.ReviewResponse;

import java.util.List;

public interface ReviewService {
    List<ReviewResponse> getAll();
    PageResponse<ReviewResponse> getAllPaginated(int page, int size, String keyword);
    List<ReviewResponse> getAllByProductId(Integer productId);
    ReviewResponse getById(Integer reviewId);
    ReviewResponse create(ReviewRequest request, Integer productId);
    ReviewResponse update(Integer reviewId, ReviewRequest request);
    Boolean delete(Integer id);
    ReviewResponse toggleHidden(Integer reviewId);
}
