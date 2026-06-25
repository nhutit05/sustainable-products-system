package ctu.student.regreen.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import ctu.student.regreen.config.JwtAuthenticationFilter;
import ctu.student.regreen.dto.request.ReviewRequest;
import ctu.student.regreen.dto.response.ReviewResponse;
import ctu.student.regreen.service.implement.JwtService;
import ctu.student.regreen.service.interfaces.ReviewService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ReviewController.class)
@AutoConfigureMockMvc(addFilters = false)
public class ReviewControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private ReviewService reviewService;

    private ReviewRequest reviewRequest;

    private ReviewResponse reviewResponse;

    @BeforeEach
    public void initData() {
        reviewRequest = new ReviewRequest();

        reviewRequest.setReviewContent("Great product!");
        reviewRequest.setReviewRating(4);
        reviewRequest.setProductId(1);
        reviewRequest.setCustomerId(23);

        reviewResponse = new ReviewResponse(
                1,
                "Great product!",
                4,
                1,
                23
        );
    }

//    ================= CREATE REVIEW =================

    @Test
    void create_review_success() throws Exception {
        // GIVEN
        ObjectMapper objectMapper = new ObjectMapper();
        String content = objectMapper.writeValueAsString(reviewRequest);

        when(reviewService.create(any(ReviewRequest.class))).thenReturn(reviewResponse);

        // WHEN
        mockMvc.perform(
                        post("/api/products/1/reviews")
                                .contentType("application/json")
                                .content(content))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reviewId")
                        .value(reviewResponse.getReviewId()));
    }

//    ================ GET REVIEW BY ID =================

    @Test
    void get_review_by_id_success() throws Exception {
        when(reviewService.getById(1))
                .thenReturn(reviewResponse);

        mockMvc.perform(get("/api/reviews/1"))
                        .andExpect(status().isOk());

        verify(reviewService).getById(1);
    }

    //    ================ GET ALL REVIEWS =================
    @Test
    void get_all_reviews_success() throws Exception {
        when(reviewService.getAll())
                .thenReturn(java.util.List.of(reviewResponse));

        // WHEN
        mockMvc.perform(
                get("/api/reviews"))
                .andExpect(status().isOk());

        verify(reviewService).getAll();
    }

    //    ================ GET ALL REVIEWS BY PRODUCT ID =================
    @Test
    void getAllReviewsByProductId() throws Exception {
        // GIVEN
        when(reviewService.getAllByProductId(1))
                .thenReturn(java.util.List.of(reviewResponse));

        // WHEN
        mockMvc.perform(get("/api/products/1/reviews"))
                .andExpect(status().isOk());
        verify(reviewService).getAllByProductId(1);
    }

    // ================ UPDATE REVIEW =================
    @Test
    void updateReview() throws Exception {

        when(reviewService.update(1, reviewRequest))
                .thenReturn(reviewResponse);

        mockMvc.perform(put("/api/reviews/1")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(reviewRequest)))
                .andExpect(status().isOk());

        verify(reviewService).update(1, reviewRequest);
    }
}
