package ctu.student.regreen.dto.request;

import ctu.student.regreen.model.ReviewImage;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class ReviewRequest {

    @NotBlank(message = "Review content must not be blank")
    private String reviewContent;

    @NotBlank
    private Integer reviewRating;

    @NotBlank
    private Integer customerId;

    @NotBlank
    private Integer productId;

    private List<ReviewImage> reviewImages;

}
