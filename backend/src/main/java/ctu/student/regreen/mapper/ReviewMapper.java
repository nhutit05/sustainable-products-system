package ctu.student.regreen.mapper;

import ctu.student.regreen.dto.request.ReviewRequest;
import ctu.student.regreen.dto.response.ReviewResponse;
import ctu.student.regreen.model.Customer;
import ctu.student.regreen.model.Product;
import ctu.student.regreen.model.Review;
import org.springframework.stereotype.Component;

@Component
public class ReviewMapper {


    public Review toEntity(ReviewRequest request, Product product, Customer customer) {
        Review review = new Review();

        review.setReviewContent(request.getReviewContent());
        review.setReviewRating(request.getReviewRating());
        review.setReviewImages(request.getReviewImages());

        review.setCustomer(customer);
        review.setProduct(product);

        return review;
    }

    public ReviewResponse toResponse(Review review) {
        return new ReviewResponse(
                review.getReviewId(),
                review.getReviewContent(),
                review.getReviewRating(),
                review.getCustomer().getUserId(),
                review.getProduct().getProductId(),
                review.getReviewImages()
        );
    }

    public void update(ReviewRequest request, Product product, Customer customer) {
//
//
//        review.setReviewContent(request.getReviewContent());
//        review.setReviewRating(request.getReviewRating());
//        review.setReviewImages(request.getReviewImages());
//
//        review.setCustomer(customer);
//        review.setProduct(product);
    }
}
