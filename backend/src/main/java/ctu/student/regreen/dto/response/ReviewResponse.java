package ctu.student.regreen.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReviewResponse {

    private Integer reviewId;

    private String reviewContent;

    private Integer reviewRating;

    private CustomerResponse customer;

    private ProductResponse product;

}
