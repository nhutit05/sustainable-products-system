package ctu.student.regreen.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class BannerRequest {

    @NotBlank(message = "Tiêu đề banner không được trống")
    @Size(max = 200)
    private String title;

    @Size(max = 500)
    private String subtitle;

    private String content;

    @Size(max = 100)
    private String buttonText;

    @Size(max = 500)
    private String buttonLink;

    private Integer displayOrder = 0;

    private Boolean isActive = true;

    @JsonIgnore
    private MultipartFile imageFile;
}
