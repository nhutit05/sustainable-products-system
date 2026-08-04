package ctu.student.regreen.controller;

import com.fasterxml.jackson.databind.ObjectMapper;

import ctu.student.regreen.config.JwtAuthenticationFilter;
import ctu.student.regreen.dto.request.ReviewRequest;
import ctu.student.regreen.dto.response.PageResponse;
import ctu.student.regreen.dto.response.ReviewResponse;
import ctu.student.regreen.service.implement.JwtService;
import ctu.student.regreen.service.interfaces.ReviewService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ReviewController.class)
@AutoConfigureMockMvc(addFilters = false)
class ReviewControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private ReviewService reviewService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    private UserDetailsService userDetailsService;

    private ReviewResponse buildResponse(
            Integer reviewId, String content, Integer rating) {

        return new ReviewResponse(
                reviewId, content, rating, List.of(),
                1, "testuser", 1, "Eco Bottle", false);
    }

    // ================= GET ALL =================

    @Test
    @DisplayName("GET /api/reviews - success")
    void getAll_success() throws Exception {

        ReviewResponse response = buildResponse(1, "Great!", 5);

        when(reviewService.getAll())
                .thenReturn(List.of(response));

        mockMvc.perform(get("/api/reviews"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].reviewId").value(1))
                .andExpect(jsonPath("$[0].reviewContent")
                        .value("Great!"));

        verify(reviewService).getAll();
    }

    // ================= GET BY ID =================

    @Test
    @DisplayName("GET /api/reviews/{reviewId} - success")
    void getById_success() throws Exception {

        ReviewResponse response = buildResponse(1, "Nice!", 4);

        when(reviewService.getById(1)).thenReturn(response);

        mockMvc.perform(get("/api/reviews/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reviewId").value(1))
                .andExpect(jsonPath("$.reviewContent")
                        .value("Nice!"))
                .andExpect(jsonPath("$.reviewRating").value(4));

        verify(reviewService).getById(1);
    }

    // ================= CREATE =================

    @Test
    @DisplayName("POST /api/products/{productId}/reviews - success")
    void create_success() throws Exception {

        ReviewRequest request = new ReviewRequest();
        request.setReviewContent("Excellent!");
        request.setReviewRating(5);

        ReviewResponse response = buildResponse(1, "Excellent!", 5);

        when(reviewService.create(
                any(ReviewRequest.class), eq(1)))
                .thenReturn(response);

        String json = objectMapper.writeValueAsString(request);

        mockMvc.perform(multipart("/api/products/1/reviews")
                .file(new MockMultipartFile("request",
                        "request.json",
                        MediaType.APPLICATION_JSON_VALUE,
                        json.getBytes()))
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reviewId").value(1))
                .andExpect(jsonPath("$.reviewContent")
                        .value("Excellent!"));

        verify(reviewService).create(
                any(ReviewRequest.class), eq(1));
    }

    // ================= UPDATE =================

    @Test
    @DisplayName("PUT /api/reviews/{reviewId} - success")
    void update_success() throws Exception {

        ReviewRequest request = new ReviewRequest();
        request.setReviewContent("Updated!");
        request.setReviewRating(3);

        ReviewResponse response = buildResponse(1, "Updated!", 3);

        when(reviewService.update(
                eq(1), any(ReviewRequest.class)))
                .thenReturn(response);

        String json = objectMapper.writeValueAsString(request);

        mockMvc.perform(multipart("/api/reviews/1")
                .file(new MockMultipartFile("request",
                        "request.json",
                        MediaType.APPLICATION_JSON_VALUE,
                        json.getBytes()))
                .with(req -> {
                    req.setMethod("PUT");
                    return req;
                })
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reviewId").value(1))
                .andExpect(jsonPath("$.reviewContent")
                        .value("Updated!"));

        verify(reviewService).update(
                eq(1), any(ReviewRequest.class));
    }

    // ================= DELETE =================

    @Test
    @DisplayName("DELETE /api/reviews/{reviewId} - success")
    void delete_success() throws Exception {

        when(reviewService.delete(1)).thenReturn(true);

        mockMvc.perform(delete("/api/reviews/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        verify(reviewService).delete(1);
    }

    // ================= GET ALL BY PRODUCT ID =================

    @Test
    @DisplayName("GET /api/products/{productId}/reviews - success")
    void getAllByProductId_success() throws Exception {

        ReviewResponse response = buildResponse(1, "Good", 4);

        when(reviewService.getAllByProductId(1))
                .thenReturn(List.of(response));

        mockMvc.perform(get("/api/products/1/reviews"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].reviewId").value(1));

        verify(reviewService).getAllByProductId(1);
    }

    // ================= GET ALL ADMIN (PAGINATED) =================

    @Test
    @DisplayName("GET /api/admin/reviews - success")
    void getAllAdmin_success() throws Exception {

        ReviewResponse response = buildResponse(1, "Nice", 4);

        PageResponse<ReviewResponse> pageResponse =
                PageResponse.<ReviewResponse>builder()
                        .content(List.of(response))
                        .page(0)
                        .size(10)
                        .totalElements(1)
                        .totalPages(1)
                        .last(true)
                        .build();

        when(reviewService.getAllPaginated(0, 10, null))
                .thenReturn(pageResponse);

        mockMvc.perform(get("/api/admin/reviews")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].reviewId")
                        .value(1))
                .andExpect(jsonPath("$.totalElements").value(1))
                .andExpect(jsonPath("$.last").value(true));

        verify(reviewService).getAllPaginated(0, 10, null);
    }

    // ================= TOGGLE HIDDEN =================

    @Test
    @DisplayName("PATCH /api/admin/reviews/{reviewId}/toggle-hidden - success")
    void toggleHidden_success() throws Exception {

        ReviewResponse response = buildResponse(1, "Hidden", 3);

        when(reviewService.toggleHidden(1))
                .thenReturn(response);

        mockMvc.perform(patch(
                "/api/admin/reviews/1/toggle-hidden"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reviewId").value(1));

        verify(reviewService).toggleHidden(1);
    }
}
