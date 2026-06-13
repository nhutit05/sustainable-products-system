package ctu.student.regreen.controller;

import ctu.student.regreen.dto.request.ReviewImageRequest;
import ctu.student.regreen.dto.response.ReviewImageResponse;
import ctu.student.regreen.service.interfaces.ReviewImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
public class ReviewImageController {

    private final ReviewImageService service;

    // [GET] /api/reviews/{reviewId}/review-images
    @GetMapping("/api/reviews/{reviewId}/review-images")
    public List<ReviewImageResponse> getAll(@PathVariable Integer reviewId) {
        return service.getAll();
    }

    // [POST] /api/reviews/{reviewId}/review-images
    @PostMapping("/api/reviews/{reviewId}/review-images")
    public ReviewImageResponse create(@PathVariable Integer reviewId, @RequestBody ReviewImageRequest request) {
        return service.create(request);
    }

    // [DELETE] /api/reviews/{reviewId}/review-images/{id}
    @DeleteMapping("/api/reviews/{reviewId}/review-images/{id}")
    public Boolean delete(@PathVariable Integer reviewId, @PathVariable Integer id) {
        return service.delete(id);
    }
}
