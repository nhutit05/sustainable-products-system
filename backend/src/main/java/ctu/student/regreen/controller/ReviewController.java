package ctu.student.regreen.controller;

import ctu.student.regreen.dto.request.ReviewRequest;
import ctu.student.regreen.dto.response.ReviewResponse;
import ctu.student.regreen.service.interfaces.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/api/reviews")
    public ReviewResponse create(@RequestBody ReviewRequest request) {
        return service.create(request);
    }

    @PutMapping("/api/reviews/{reviewId}")
    public ReviewResponse update(
            @PathVariable Integer reviewId,
            @RequestBody ReviewRequest request) {
        return service.update(reviewId, request);
    }

    // Find review by product

    // [GET/ /api/products/{productId}/reviews
    @GetMapping("/api/products/{productId}/reviews")
    public List<ReviewResponse> getAllByProductId(@PathVariable Integer productId) {
        return service.getAllByProductId(productId);
    }

    // [POST] /api/products/{productId}/reviews
    @PostMapping("/api/products/{productId}/reviews")
    public ReviewResponse createByProductId(
            @PathVariable Integer productId,
            @RequestBody ReviewRequest request) {
        return service.create(request);
    }

}
