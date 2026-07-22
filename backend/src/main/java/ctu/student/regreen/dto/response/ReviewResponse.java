package ctu.student.regreen.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReviewResponse {

    private Integer reviewId;

    private String reviewContent;

    private Integer reviewRating;

    private Integer customerId;
    private String customerName;

    private Integer productId;

    private Boolean isHidden;

}
