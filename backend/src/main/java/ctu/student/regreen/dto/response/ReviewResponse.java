package ctu.student.regreen.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ReviewResponse {

    private Integer reviewId;
    private String reviewContent;
    private Integer reviewRating;
    private List<String> reviewImages;

    private Integer customerId;
    private String customerName;

    private Integer productId;
    private String productName;


    private Boolean isHidden;

}
