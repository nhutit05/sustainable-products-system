// package ctu.student.regreen.service;

// import ctu.student.regreen.dto.response.ReviewResponse;
// import ctu.student.regreen.mapper.ReviewMapper;
// import ctu.student.regreen.model.Review;
// import ctu.student.regreen.repository.ReviewRepository;
// import ctu.student.regreen.service.implement.ReviewServiceImpl;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.junit.jupiter.MockitoExtension;

// import java.util.List;

// import static org.mockito.Mockito.*;
// import static org.springframework.test.util.AssertionErrors.assertEquals;

// @ExtendWith(MockitoExtension.class)
// public class ReviewServiceImplTest {

//     @Mock
//     private ReviewRepository reviewRepository;

//     @Mock
//     private ReviewMapper reviewMapper;

//     @InjectMocks
//     private ReviewServiceImpl reviewService;

//     private Review review;

//     private ReviewResponse reviewResponse;

//     @BeforeEach
//     void init() {
//         review = new Review();;

//         reviewResponse = mock(ReviewResponse.class);

//         lenient()
//                 .when(reviewMapper.toResponse(review))
//                 .thenReturn(reviewResponse);
//     }

//     @Test
//     void getAll_success() {

//         when(reviewRepository.findAll())
//                 .thenReturn(List.of(review));

//         List<ReviewResponse> result = reviewService.getAll();

//         assertEquals("Expected one review response", 1, result.size());

//         verify(reviewRepository).findAll();
//     }

//     @Test
//     void getAllByCustomerAndProduct_success() {

//         Integer customerId = 1;
//         Integer productId = 1;

//         when(reviewRepository.findByCustomerUserIdAndProductProductId(customerId, productId))
//                 .thenReturn(List.of(review));

//         List<ReviewResponse> result = reviewService.getAllByCustomerAndProduct(customerId, productId);

//         assertEquals("Expected one review response", 1, result.size());

//         verify(reviewRepository).findByCustomerUserIdAndProductProductId(customerId, productId);
//     }

//     @Test
//     void getAllByProductId_success() {

//         Integer productId = 1;

//         when(reviewRepository.findByProductProductId(productId))
//                 .thenReturn(List.of(review));

//         List<ReviewResponse> result = reviewService.getAllByProductId(productId);

//         assertEquals("Expected one review response", 1, result.size());

//         verify(reviewRepository).findByProductProductId(productId);
//     }

//     @Test
//     void getAllByCustomerId_success() {

//         Integer customerId = 1;

//         when(reviewRepository.findByCustomerUserId(customerId))
//                 .thenReturn(List.of(review));

//         List<ReviewResponse> result = reviewService.getAllByCustomerId(customerId);

//         assertEquals("Expected one review response", 1, result.size());

//         verify(reviewRepository).findByCustomerUserId(customerId);
//     }

//     @Test
//     void getById_success() {

//         Integer reviewId = 1;

//         when(reviewRepository.findById(reviewId))
//                 .thenReturn(java.util.Optional.of(review));

//         ReviewResponse result = reviewService.getById(reviewId);

//         assertEquals("Expected review response to be not null", reviewResponse, result);

//         verify(reviewRepository).findById(reviewId);
//     }

//     @Test
//     void getById_notFound() {

//         Integer reviewId = 1;

//         when(reviewRepository.findById(reviewId))
//                 .thenReturn(java.util.Optional.empty());

//         try {
//             reviewService.getById(reviewId);
//         } catch (RuntimeException e) {
//             assertEquals("Expected exception message", "Review not found", e.getMessage());
//         }

//         verify(reviewRepository).findById(reviewId);

//     }

// }
