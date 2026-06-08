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
    private Integer review_image_id;

    @NotBlank(message = "URL hình ảnh không được để trống")
    @Column(nullable = false)
    private String review_image_url;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "review_id", nullable = false)
    private Review review;
}
