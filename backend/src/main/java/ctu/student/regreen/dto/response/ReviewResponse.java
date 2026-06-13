package ctu.student.regreen.dto.response;

import ctu.student.regreen.model.ReviewImage;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ReviewResponse {

    private Integer reviewId;

    private String reviewContent;

    private Integer reviewRating;

    private Integer customerId;

    private Integer productId;

    private List<ReviewImage> reviewImages;
}
