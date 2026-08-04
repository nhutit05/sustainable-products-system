package ctu.student.regreen.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.multipart.MultipartFile;

import ctu.student.regreen.dto.request.ReviewRequest;
import ctu.student.regreen.dto.response.ReviewResponse;
import ctu.student.regreen.mapper.ReviewMapper;
import ctu.student.regreen.model.Customer;
import ctu.student.regreen.model.Product;
import ctu.student.regreen.model.Review;
import ctu.student.regreen.repository.CustomerRepository;
import ctu.student.regreen.repository.ProductRepository;
import ctu.student.regreen.repository.ReviewRepository;
import ctu.student.regreen.service.implement.ReviewServiceImpl;
import ctu.student.regreen.service.interfaces.ReviewImageService;

@ExtendWith(MockitoExtension.class)
class ReviewServiceImplTest {

    @Mock
    private ReviewRepository repository;

    @Mock
    private ReviewMapper mapper;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ReviewImageService reviewImageService;

    @InjectMocks
    private ReviewServiceImpl service;

    private Authentication authentication;
    private SecurityContext securityContext;
    private Customer customer;
    private Product product;
    private Review review;
    private ReviewResponse response;

    @BeforeEach
    void setUp() {

        authentication = mock(Authentication.class);
        securityContext = mock(SecurityContext.class);

        lenient().when(authentication.getName())
                .thenReturn("testuser");
        lenient().when(securityContext.getAuthentication())
                .thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        customer = new Customer();
        customer.setUserId(1);
        customer.setUsername("testuser");

        product = new Product();
        product.setProductId(1);
        product.setProductName("Eco Bottle");

        review = new Review();
        review.setReviewId(1);
        review.setReviewContent("Great product");
        review.setReviewRating(5);
        review.setIsHidden(false);
        review.setReviewImages(new ArrayList<>());
        review.setCustomer(customer);
        review.setProduct(product);

        response = new ReviewResponse(
                1, "Great product", 5, List.of(),
                1, "testuser", 1, "Eco Bottle", false);
    }

    @AfterEach
    void tearDown() {

        SecurityContextHolder.clearContext();
    }

    @Test
    void getAll_success() {

        when(repository.findAll())
                .thenReturn(List.of(review));
        when(mapper.toResponse(review))
                .thenReturn(response);

        List<ReviewResponse> result = service.getAll();

        assertEquals(1, result.size());
        assertEquals(1, result.get(0).getReviewId());
        verify(repository).findAll();
        verify(mapper).toResponse(review);
    }

    @Test
    void getAll_empty() {

        when(repository.findAll())
                .thenReturn(List.of());

        List<ReviewResponse> result = service.getAll();

        assertTrue(result.isEmpty());
        verify(repository).findAll();
        verify(mapper, never()).toResponse(any());
    }

    @Test
    void getAllPaginated_success() {

        PageRequest pageable = PageRequest.of(
                0, 10, Sort.by("reviewId").descending());

        Page<Review> page = new PageImpl<>(
                List.of(review), pageable, 1);

        when(repository.findAllPaginated(eq(""), any()))
                .thenReturn(page);
        when(mapper.toResponse(review))
                .thenReturn(response);

        var result = service.getAllPaginated(0, 10, null);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals(0, result.getPage());
        assertEquals(10, result.getSize());
        assertEquals(1, result.getTotalElements());
        assertEquals(1, result.getTotalPages());
        assertTrue(result.isLast());
        verify(repository).findAllPaginated(eq(""), any());
    }

    @Test
    void getAllPaginated_withKeyword() {

        PageRequest pageable = PageRequest.of(
                0, 10, Sort.by("reviewId").descending());

        Page<Review> page = new PageImpl<>(
                List.of(review), pageable, 1);

        when(repository.findAllPaginated(eq("eco"), any()))
                .thenReturn(page);
        when(mapper.toResponse(review))
                .thenReturn(response);

        var result = service.getAllPaginated(0, 10, "eco");

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(repository).findAllPaginated(eq("eco"), any());
    }

    @Test
    void getAllPaginated_empty() {

        PageRequest pageable = PageRequest.of(
                0, 10, Sort.by("reviewId").descending());

        Page<Review> page = new PageImpl<>(
                List.of(), pageable, 0);

        when(repository.findAllPaginated(eq(""), any()))
                .thenReturn(page);

        var result = service.getAllPaginated(0, 10, "");

        assertNotNull(result);
        assertTrue(result.getContent().isEmpty());
        assertEquals(0, result.getTotalElements());
    }

    @Test
    void getAllByProductId_success() {

        when(repository.findByProductProductIdAndIsHiddenFalse(1))
                .thenReturn(List.of(review));
        when(mapper.toResponse(review))
                .thenReturn(response);

        List<ReviewResponse> result =
                service.getAllByProductId(1);

        assertEquals(1, result.size());
        assertEquals(1, result.get(0).getReviewId());
        verify(repository)
                .findByProductProductIdAndIsHiddenFalse(1);
    }

    @Test
    void getAllByProductId_empty() {

        when(repository
                .findByProductProductIdAndIsHiddenFalse(1))
                .thenReturn(List.of());

        List<ReviewResponse> result =
                service.getAllByProductId(1);

        assertTrue(result.isEmpty());
    }

    @Test
    void getById_success() {

        when(repository.findById(1))
                .thenReturn(Optional.of(review));
        when(mapper.toResponse(review))
                .thenReturn(response);

        ReviewResponse result = service.getById(1);

        assertNotNull(result);
        assertEquals(1, result.getReviewId());
        verify(repository).findById(1);
        verify(mapper).toResponse(review);
    }

    @Test
    void getById_notFound_fail() {

        when(repository.findById(999))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.getById(999));

        assertEquals("Review not found", ex.getMessage());
    }

    @Test
    void create_success_noImages() {

        ReviewRequest request = new ReviewRequest();
        request.setReviewContent("Nice");
        request.setReviewRating(4);
        request.setReviewImages(new ArrayList<>());

        when(customerRepository.findByUsername("testuser"))
                .thenReturn(Optional.of(customer));
        when(productRepository.findById(1))
                .thenReturn(Optional.of(product));
        when(mapper.toEntity(any(), any(), any(), any()))
                .thenReturn(review);
        when(repository.save(review))
                .thenReturn(review);
        when(mapper.toResponse(review))
                .thenReturn(response);

        ReviewResponse result = service.create(request, 1);

        assertNotNull(result);
        verify(reviewImageService, never())
                .create(any(MultipartFile.class));
        verify(mapper).toEntity(request, List.of(), customer, product);
        verify(repository).save(review);
    }

    @Test
    void create_success_withImages() {

        MultipartFile image1 = mock(MultipartFile.class);
        MultipartFile image2 = mock(MultipartFile.class);

        ReviewRequest request = new ReviewRequest();
        request.setReviewContent("Nice");
        request.setReviewRating(4);
        request.setReviewImages(List.of(image1, image2));

        when(customerRepository.findByUsername("testuser"))
                .thenReturn(Optional.of(customer));
        when(productRepository.findById(1))
                .thenReturn(Optional.of(product));
        when(reviewImageService.create(image1))
                .thenReturn("http://img/1.jpg");
        when(reviewImageService.create(image2))
                .thenReturn("http://img/2.jpg");
        when(mapper.toEntity(
                any(), any(), any(), any()))
                .thenReturn(review);
        when(repository.save(review))
                .thenReturn(review);
        when(mapper.toResponse(review))
                .thenReturn(response);

        ReviewResponse result = service.create(request, 1);

        assertNotNull(result);
        verify(reviewImageService).create(image1);
        verify(reviewImageService).create(image2);
        verify(mapper).toEntity(
                eq(request), eq(List.of(
                        "http://img/1.jpg",
                        "http://img/2.jpg")),
                eq(customer), eq(product));
    }

    @Test
    void create_customerNotFound_fail() {

        ReviewRequest request = new ReviewRequest();
        request.setReviewContent("Nice");
        request.setReviewRating(4);
        request.setReviewImages(new ArrayList<>());

        when(customerRepository.findByUsername("testuser"))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.create(request, 1));

        assertEquals("Customer not found", ex.getMessage());
    }

    @Test
    void create_productNotFound_fail() {

        ReviewRequest request = new ReviewRequest();
        request.setReviewContent("Nice");
        request.setReviewRating(4);
        request.setReviewImages(new ArrayList<>());

        when(customerRepository.findByUsername("testuser"))
                .thenReturn(Optional.of(customer));
        when(productRepository.findById(999))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.create(request, 999));

        assertEquals("Product not found", ex.getMessage());
    }

    @Test
    void update_success_noImages() {

        ReviewRequest request = new ReviewRequest();
        request.setReviewContent("Updated");
        request.setReviewRating(3);
        request.setReviewImages(new ArrayList<>());

        when(repository.findById(1))
                .thenReturn(Optional.of(review));
        when(repository.save(review))
                .thenReturn(review);
        when(mapper.toResponse(review))
                .thenReturn(response);

        ReviewResponse result = service.update(1, request);

        assertNotNull(result);
        verify(reviewImageService, never())
                .create(any(MultipartFile.class));
        verify(mapper).update(review, request, review.getReviewImages());
        verify(repository).save(review);
    }

    @Test
    void update_success_withImages() {

        MultipartFile image = mock(MultipartFile.class);

        ReviewRequest request = new ReviewRequest();
        request.setReviewContent("Updated");
        request.setReviewRating(3);
        request.setReviewImages(List.of(image));

        when(repository.findById(1))
                .thenReturn(Optional.of(review));
        when(reviewImageService.create(image))
                .thenReturn("http://img/new.jpg");
        when(repository.save(review))
                .thenReturn(review);
        when(mapper.toResponse(review))
                .thenReturn(response);

        ReviewResponse result = service.update(1, request);

        assertNotNull(result);
        verify(reviewImageService).create(image);
        verify(repository).save(review);
    }

    @Test
    void update_reviewNotFound_fail() {

        ReviewRequest request = new ReviewRequest();
        request.setReviewContent("Updated");
        request.setReviewRating(3);
        request.setReviewImages(new ArrayList<>());

        when(repository.findById(999))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.update(999, request));

        assertEquals("Review not found", ex.getMessage());
    }

    @Test
    void delete_success() {

        when(repository.findById(1))
                .thenReturn(Optional.of(review));

        Boolean result = service.delete(1);

        assertTrue(result);
        verify(repository).delete(review);
    }

    @Test
    void delete_reviewNotFound_fail() {

        when(repository.findById(999))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.delete(999));

        assertEquals("Review not found", ex.getMessage());
        verify(repository, never()).delete(any());
    }

    @Test
    void toggleHidden_success() {

        review.setIsHidden(false);

        when(repository.findById(1))
                .thenReturn(Optional.of(review));
        when(repository.save(review))
                .thenReturn(review);
        when(mapper.toResponse(review))
                .thenReturn(response);

        ReviewResponse result = service.toggleHidden(1);

        assertNotNull(result);

        ArgumentCaptor<Review> captor =
                ArgumentCaptor.forClass(Review.class);
        verify(repository).save(captor.capture());
        assertTrue(captor.getValue().getIsHidden());
    }

    @Test
    void toggleHidden_alreadyHidden_success() {

        review.setIsHidden(true);

        when(repository.findById(1))
                .thenReturn(Optional.of(review));
        when(repository.save(review))
                .thenReturn(review);
        when(mapper.toResponse(review))
                .thenReturn(response);

        ReviewResponse result = service.toggleHidden(1);

        assertNotNull(result);

        ArgumentCaptor<Review> captor =
                ArgumentCaptor.forClass(Review.class);
        verify(repository).save(captor.capture());
        assertEquals(false, captor.getValue().getIsHidden());
    }

    @Test
    void toggleHidden_reviewNotFound_fail() {

        when(repository.findById(999))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.toggleHidden(999));

        assertEquals("Review not found", ex.getMessage());
    }
}
