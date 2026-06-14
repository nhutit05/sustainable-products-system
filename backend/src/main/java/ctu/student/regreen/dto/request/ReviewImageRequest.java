package ctu.student.regreen.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReviewImageRequest {

    @NotBlank
    private String reviewImageUrl;

    @NotBlank
    private Integer reviewId;

}
