package ctu.student.regreen.service.implement;
import ctu.student.regreen.mapper.ReviewImageMapper;
import ctu.student.regreen.repository.ReviewImageRepository;
import ctu.student.regreen.service.interfaces.CloudinaryService;
import ctu.student.regreen.service.interfaces.ReviewImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReviewImageServiceImpl implements ReviewImageService {

    private final ReviewImageRepository repository;
    private final ReviewImageMapper mapper;

    private final CloudinaryService cloudinaryService;

//    public List<ReviewImageResponse> getAll() {
//        return repository.findAll()
//                .stream()
//                .map(mapper::toResponse)
//                .toList();
//    }

//    public List<ReviewImageResponse> getAllByReviewId(Integer reviewId) {
//        return repository.findByReviewReviewId(reviewId)
//                .stream()
//                .map(mapper::toResponse)
//                .toList();
//    }

//    @Override
//    public ReviewImageResponse getReviewByIdReviewImageById(Integer reviewId, Integer id) {
//        return mapper.toResponse(
//                repository.findByReviewReviewIdAndReviewImageId(reviewId, id)
//                        .orElseThrow(() -> new RuntimeException("Review image not found with review id: " + reviewId + " and review image id: " + id))
//        );
//    }

    @Override
    public String create(MultipartFile image) {

        Map upload = cloudinaryService.uploadImage(image);
        String url = (String) upload.get("url");
        return url;
    }

//    @Override
//    public ReviewImageResponse update(Integer id, MultipartFile image) {
//        ReviewImage entity = repository.findByReviewImageId(id)
//                .orElseThrow(() -> new RuntimeException("Review image not found with id: " + id));
//
//        Map upload = cloudinaryService.uploadImage(image);
//        String url = (String) upload.get("url");
//        ReviewImageRequest request = new ReviewImageRequest(url);
//        mapper.update(id, entity, request);
//        return mapper.toResponse(repository.save(entity));
//    }

//    @Override
//    public Boolean deleteReviewImageByReviewId(Integer reviewId, Integer id) {
//        repository.deleteByReviewReviewIdAndReviewImageId(reviewId, id)
//                .orElseThrow(() -> new RuntimeException("Review image not found with review id: " + reviewId + " and review image id: " + id));
//        return true;
//    }

    @Override
    public Boolean deleteById(Integer id) {
        repository.deleteById(id);
        return true;
    }
}
