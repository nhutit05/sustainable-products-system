package ctu.student.regreen.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class ReviewRequest {

    @NotBlank(message = "Review content must not be blank")
    private String reviewContent;

    @NotNull
    private Integer reviewRating;

    @JsonIgnore
    private List<MultipartFile> reviewImages;
}
