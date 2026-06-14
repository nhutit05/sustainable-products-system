package ctu.student.regreen.dto.response;

import ctu.student.regreen.model.Review;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReviewImageResponse {

    private Integer id;

    private String reviewImageUrl;

    private ReviewResponse review;
}
