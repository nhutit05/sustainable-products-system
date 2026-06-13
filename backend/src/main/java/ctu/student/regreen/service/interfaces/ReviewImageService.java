package ctu.student.regreen.service.interfaces;

import ctu.student.regreen.dto.request.ReviewImageRequest;
import ctu.student.regreen.dto.response.ReviewImageResponse;

import java.util.List;

public interface ReviewImageService {
    List<ReviewImageResponse> getAll();
    List<ReviewImageResponse> getAllByReviewId(Integer reviewId);
    ReviewImageResponse getById(Integer id);
    ReviewImageResponse create(ReviewImageRequest request);
    ReviewImageResponse update(Integer id, ReviewImageRequest request);
    Boolean delete(Integer id);
}
