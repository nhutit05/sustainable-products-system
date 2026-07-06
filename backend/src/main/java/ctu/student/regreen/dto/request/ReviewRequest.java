package ctu.student.regreen.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReviewRequest {

    @NotBlank(message = "Review content must not be blank")
    private String reviewContent;

    @NotNull
    private Integer reviewRating;

}
