package ctu.student.regreen.controller;

import ctu.student.regreen.dto.request.ReviewImageRequest;
import ctu.student.regreen.dto.response.ReviewImageResponse;
import ctu.student.regreen.service.interfaces.ReviewImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
public class ReviewImageController {

    private final ReviewImageService service;

    // [GET] /api/reviews/{reviewId}/review-images
    @GetMapping("/api/reviews/{reviewId}/review-images")
    public List<ReviewImageResponse> getAllByReviewId(@PathVariable Integer reviewId) {
        return service.getAllByReviewId(reviewId);
    }

    // [GET] /api/reviews/{reviewId}/review-images/{id}
    @GetMapping("/api/reviews/{reviewId}/review-images/{id}")
    public ReviewImageResponse getReviewImageIdFromReview(@PathVariable Integer reviewId, @PathVariable Integer id) {
        return service.getReviewByIdReviewImageById(reviewId, id);
    }

    // [POST] /api/reviews/{reviewId}/review-images
    @PostMapping("/api/reviews/{reviewId}/review-images")
    public ReviewImageResponse create(
            @PathVariable Integer reviewId,
            @RequestParam("image") MultipartFile image) {
        return service.create(reviewId, image);
    }

    // [PUT] /api/reviews/{reviewId}/review-images/{id}
    @PutMapping("/api/reviews/{reviewId}/review-images/{id}")
    public ReviewImageResponse update(
            @PathVariable Integer reviewId,
            @PathVariable Integer id,
            @RequestParam("image") MultipartFile request) {
        return service.update(id, request);
    }

    // [DELETE] /api/reviews/{reviewId}/review-images/{id}
    @DeleteMapping("/api/reviews/{reviewId}/review-images/{id}")
    public Boolean delete(@PathVariable Integer reviewId, @PathVariable Integer id) {
        return service.deleteReviewImageByReviewId(reviewId, id);
    }
}
