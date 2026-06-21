package ctu.student.regreen.service.implement;

import ctu.student.regreen.dto.request.ReviewImageRequest;
import ctu.student.regreen.dto.response.ReviewImageResponse;
import ctu.student.regreen.mapper.ReviewImageMapper;
import ctu.student.regreen.model.Review;
import ctu.student.regreen.model.ReviewImage;
import ctu.student.regreen.repository.ReviewImageRepository;
import ctu.student.regreen.repository.ReviewRepository;
import ctu.student.regreen.service.interfaces.CloudinaryService;
import ctu.student.regreen.service.interfaces.ReviewImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReviewImageServiceImpl implements ReviewImageService {

    private final ReviewImageRepository repository;
    private final ReviewImageMapper mapper;
    private final ReviewRepository reviewRepository;

    private final CloudinaryService cloudinaryService;

    public List<ReviewImageResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    public List<ReviewImageResponse> getAllByReviewId(Integer reviewId) {
        return repository.findByReviewReviewId(reviewId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public ReviewImageResponse getReviewByIdReviewImageById(Integer reviewId, Integer id) {
        return mapper.toResponse(
                repository.findByReviewReviewIdAndReviewImageId(reviewId, id)
                        .orElseThrow(() -> new RuntimeException("Review image not found with review id: " + reviewId + " and review image id: " + id))
        );
    }

    @Override
    public ReviewImageResponse create(Integer reviewId, MultipartFile image) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + reviewId));

        Map upload = cloudinaryService.uploadImage(image);

        String url = (String) upload.get("url");
        ReviewImageRequest request = new ReviewImageRequest(url);
        return mapper.toResponse(
                repository.save(
                        mapper.toEntity(review, request
                        )
                )
        );
    }

    @Override
    public ReviewImageResponse update(Integer id, MultipartFile image) {
        ReviewImage entity = repository.findByReviewImageId(id)
                .orElseThrow(() -> new RuntimeException("Review image not found with id: " + id));

        Map upload = cloudinaryService.uploadImage(image);
        String url = (String) upload.get("url");
        ReviewImageRequest request = new ReviewImageRequest(url);
        mapper.update(id, entity, request);
        return mapper.toResponse(repository.save(entity));
    }

    @Override
    public Boolean deleteReviewImageByReviewId(Integer reviewId, Integer id) {
        repository.deleteByReviewReviewIdAndReviewImageId(reviewId, id)
                .orElseThrow(() -> new RuntimeException("Review image not found with review id: " + reviewId + " and review image id: " + id));
        return true;
    }
}
