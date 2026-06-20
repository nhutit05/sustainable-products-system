package ctu.student.regreen.mapper;

import ctu.student.regreen.dto.request.ReviewRequest;
import ctu.student.regreen.dto.response.ReviewResponse;
import ctu.student.regreen.model.Customer;
import ctu.student.regreen.model.Product;
import ctu.student.regreen.model.Review;
import ctu.student.regreen.repository.CustomerRepository;
import ctu.student.regreen.repository.ProductRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class ReviewMapper {

    private final CustomerMapper customerMapper;
    private final ProductMapper productMapper;

    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    public Review toEntity(ReviewRequest request) {
        Review review = new Review();

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() ->
                        new RuntimeException("Customer not found with id: " + request.getCustomerId()));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() ->
                        new RuntimeException("Product not found with id: " + request.getProductId()));

        review.setReviewContent(request.getReviewContent());
        review.setReviewRating(request.getReviewRating());
        review.setProduct(product);
        review.setCustomer(customer);

        return review;
    }

    public ReviewResponse toResponse(Review review) {
        return new ReviewResponse(
                review.getReviewId(),
                review.getReviewContent(),
                review.getReviewRating(),
                review.getCustomer().getUserId(),
                review.getProduct().getProductId()
        );
    }

    public void update(Review review, ReviewRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() ->
                        new RuntimeException("Customer not found with id: " + request.getCustomerId()));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() ->
                        new RuntimeException("Product not found with id: " + request.getProductId()));

        review.setReviewRating(request.getReviewRating());
        review.setReviewContent(request.getReviewContent());
        review.setProduct(product);
        review.setCustomer(customer);

    }
}
