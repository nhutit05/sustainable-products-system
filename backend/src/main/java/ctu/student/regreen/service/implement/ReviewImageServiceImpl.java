package ctu.student.regreen.service.implement;

import ctu.student.regreen.dto.request.ReviewImageRequest;
import ctu.student.regreen.dto.response.ReviewImageResponse;
import ctu.student.regreen.mapper.ReviewImageMapper;
import ctu.student.regreen.model.ReviewImage;
import ctu.student.regreen.repository.ReviewImageRepository;
import ctu.student.regreen.service.interfaces.ReviewImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewImageServiceImpl implements ReviewImageService {

    private final ReviewImageRepository repository;
    private final ReviewImageMapper mapper;

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
    public ReviewImageResponse create(ReviewImageRequest request) {
        ReviewImage entity = mapper.toEntity(request);
        return mapper.toResponse(repository.save(entity));
    }

    @Override
    public ReviewImageResponse update(Integer id, ReviewImageRequest request) {
        ReviewImage entity = repository.findByReviewImageId(id)
                .orElseThrow(() -> new RuntimeException("Review image not found with id: " + id));
        mapper.update(entity, request);
        return mapper.toResponse(repository.save(entity));
    }

    @Override
    public Boolean deleteReviewImageByReviewId(Integer reviewId, Integer id) {
        repository.deleteByReviewReviewIdAndReviewImageId(reviewId, id)
                .orElseThrow(() -> new RuntimeException("Review image not found with review id: " + reviewId + " and review image id: " + id));
        return true;
    }
}
