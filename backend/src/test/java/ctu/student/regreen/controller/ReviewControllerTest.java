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
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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

    @Test
    void createReview() throws Exception {
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
}
