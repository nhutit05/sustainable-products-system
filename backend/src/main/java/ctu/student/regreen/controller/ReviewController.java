package ctu.student.regreen.controller;

import ctu.student.regreen.dto.request.ReviewRequest;
import ctu.student.regreen.dto.response.ReviewResponse;
import ctu.student.regreen.service.interfaces.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService service;

    // [GET] /api/reviews
    @GetMapping("/api/reviews")
    public List<ReviewResponse> getAll() {
        return service.getAll();
    }

    // [GET] /api/reviews/{reviewId}
    @GetMapping("/api/reviews/{reviewId}")
    public ReviewResponse getById(@PathVariable Integer reviewId) {
        return service.getById(reviewId);
    }

    @PutMapping("/api/reviews/{reviewId}")
    public ReviewResponse update(
            @PathVariable Integer reviewId,
            @RequestPart("request") ReviewRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        request.setReviewImages(images);
        return service.update(reviewId, request);
    }

    @DeleteMapping("/api/reviews/{reviewId}")
    public Boolean delete(@PathVariable Integer reviewId) {
        return service.delete(reviewId);
    }


    // [GET/ /api/products/{productId}/reviews
    @GetMapping("/api/products/{productId}/reviews")
    public List<ReviewResponse> getAllByProductId(@PathVariable Integer productId) {
        return service.getAllByProductId(productId);
    }


    // [POST] /api/products/{productId}/reviews
    @PostMapping("/api/products/{productId}/reviews")
    public ReviewResponse createByProductId(
            @PathVariable Integer productId,
            @RequestPart("request") ReviewRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        request.setReviewImages(images);
        return service.create(request, productId);
    }
}
