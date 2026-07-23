package ctu.student.regreen.service.interfaces;

import ctu.student.regreen.dto.response.ReviewImageResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ReviewImageService {
//    List<ReviewImageResponse> getAll();
//    List<ReviewImageResponse> getAllByReviewId(Integer reviewId);
//    ReviewImageResponse getReviewByIdReviewImageById(Integer reviewId, Integer id);
    String create(MultipartFile image);
//    ReviewImageResponse update(Integer id, MultipartFile request);
//    Boolean deleteReviewImageByReviewId(Integer reviewId, Integer id);
    Boolean deleteById(Integer id);
}
