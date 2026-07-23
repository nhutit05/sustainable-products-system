package ctu.student.regreen.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class BannerResponse {

    private Integer bannerId;
    private String title;
    private String subtitle;
    private String content;
    private String imageUrl;
    private String buttonText;
    private String buttonLink;
    private Integer displayOrder;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
