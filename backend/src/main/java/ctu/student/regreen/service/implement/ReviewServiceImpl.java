package ctu.student.regreen.service.implement;

import ctu.student.regreen.dto.request.ReviewRequest;
import ctu.student.regreen.dto.response.PageResponse;
import ctu.student.regreen.dto.response.ReviewResponse;
import ctu.student.regreen.mapper.ReviewMapper;
import ctu.student.regreen.model.Customer;
import ctu.student.regreen.model.Product;
import ctu.student.regreen.model.Review;
import ctu.student.regreen.repository.CustomerRepository;
import ctu.student.regreen.repository.ProductRepository;
import ctu.student.regreen.repository.ReviewRepository;
import ctu.student.regreen.service.interfaces.ReviewService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository repository;
    private final ReviewMapper mapper;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    private Customer getCurrentCustomer() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        return customerRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    public List<ReviewResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    public PageResponse<ReviewResponse> getAllPaginated(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("reviewId").descending());
        if (keyword == null) keyword = "";
        keyword = keyword.trim();

        Page<Review> reviewPage = repository.findAllPaginated(keyword, pageable);

        List<ReviewResponse> responses = reviewPage.getContent().stream()
                .map(mapper::toResponse)
                .toList();

        return PageResponse.<ReviewResponse>builder()
                .content(responses)
                .page(reviewPage.getNumber())
                .size(reviewPage.getSize())
                .totalElements(reviewPage.getTotalElements())
                .totalPages(reviewPage.getTotalPages())
                .last(reviewPage.isLast())
                .build();
    }

//    public List<ReviewResponse> getAllByCustomerAndProduct(
//            Integer customerId,
//            Integer productId) {
//
//        return repository
//                .findByCustomerUserIdAndProductProductId(
//                        customerId,
//                        productId)
//                .stream()
//                .map(mapper::toResponse)
//                .toList();
//    }

    public List<ReviewResponse> getAllByProductId(Integer productId) {
        return repository.findByProductProductIdAndIsHiddenFalse(productId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

//    public Integer getCountByProductId(Integer productId) {
//        return getAllByProductId(productId).size();
//    }

//    public List<ReviewResponse> getAllByCustomerId(Integer customerId) {
//        return repository.findByCustomerUserId(customerId)
//                .stream()
//                .map(mapper::toResponse)
//                .toList();
//    }

//    public List<ReviewResponse> getAllByRating(Integer rating) {
//        return repository.findByReviewRating(rating)
//                .stream()
//                .map(mapper::toResponse)
//                .toList();
//    }

    public ReviewResponse getById(Integer reviewId) {
        Review review = repository.findById(reviewId)
                .orElseThrow(() ->
                        new RuntimeException("Review not found"));
        return mapper.toResponse(review);
    }

    public ReviewResponse create(ReviewRequest request, Integer productId) {
        Customer customer = getCurrentCustomer();

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Review review = mapper.toEntity(request, customer, product);
        return mapper.toResponse(repository.save(review));
    }

    public ReviewResponse update(Integer reviewId, ReviewRequest request) {
        Review review = repository.findById(reviewId)
                .orElseThrow(() ->
                        new RuntimeException("Review not found"));

        mapper.update(review, request);

        return mapper.toResponse(repository.save(review));
    }

    public Boolean delete(Integer id) {
        Review review = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Review not found"));
        repository.delete(review);
        return true;
    }

    public ReviewResponse toggleHidden(Integer reviewId) {
        Review review = repository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        review.setIsHidden(!review.getIsHidden());
        return mapper.toResponse(repository.save(review));
    }
}
