package ctu.student.regreen.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "review_images")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ReviewImage {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    @Column(name = "review_image_id", nullable = false, updatable = false)
    private Integer reviewImageId;

    @NotBlank(message = "URL hình ảnh không được để trống")
    @Column(name = "review_image_url", nullable = false)
    private String reviewImageUrl;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "review_id", nullable = false)
    private Review review;
}
