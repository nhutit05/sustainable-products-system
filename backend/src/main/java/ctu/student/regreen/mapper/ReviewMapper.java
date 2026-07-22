package ctu.student.regreen.mapper;

import ctu.student.regreen.dto.request.ReviewRequest;
import ctu.student.regreen.dto.response.ReviewResponse;
import ctu.student.regreen.model.Customer;
import ctu.student.regreen.model.Product;
import ctu.student.regreen.model.Review;
import ctu.student.regreen.repository.CustomerRepository;
import ctu.student.regreen.repository.ProductRepository;
import ctu.student.regreen.service.interfaces.ReviewImageService;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;


@Component
@RequiredArgsConstructor
public class ReviewMapper {

    public Review toEntity(ReviewRequest request,
                           List<String> reviewImageUrls,
                           Customer customer,
                           Product product) {
        Review review = new Review();

        review.setReviewContent(request.getReviewContent());
        review.setReviewRating(request.getReviewRating());
        review.setReviewImages(reviewImageUrls);
        review.setProduct(product);
        review.setCustomer(customer);

        return review;
    }

    public ReviewResponse toResponse(Review review) {

        return new ReviewResponse(
                review.getReviewId(),
                review.getReviewContent(),
                review.getReviewRating(),
                review.getReviewImages(),
                review.getCustomer().getUserId(),
                review.getCustomer().getUsername(),
                review.getProduct().getProductId(),
                review.getProduct().getProductName(),
                review.getIsHidden()
        );
    }

    public void update(Review review,
                       ReviewRequest request,
                       List<String> reviewImageUrls) {
        review.setReviewRating(request.getReviewRating());
        review.setReviewContent(request.getReviewContent());
        review.setReviewImages(reviewImageUrls);
    }
}
