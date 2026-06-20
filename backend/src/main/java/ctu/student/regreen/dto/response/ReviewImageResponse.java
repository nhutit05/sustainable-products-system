package ctu.student.regreen.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReviewImageResponse {

    private Integer id;

    private String reviewImageUrl;

    private ReviewResponse review;
}
