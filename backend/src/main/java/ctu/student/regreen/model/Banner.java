package ctu.student.regreen.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "banners")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Banner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "banner_id")
    private Integer bannerId;

    @NotBlank(message = "Tiêu đề banner không được trống")
    @Size(max = 200, message = "Tiêu đề banner tối đa 200 ký tự")
    @Column(nullable = false, name = "title", length = 200)
    private String title;

    @Size(max = 500, message = "Tiêu đề phụ tối đa 500 ký tự")
    @Column(name = "subtitle", length = 500)
    private String subtitle;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @NotBlank(message = "URL hình ảnh không được trống")
    @Size(max = 500, message = "URL hình ảnh tối đa 500 ký tự")
    @Column(nullable = false, name = "image_url", length = 500)
    private String imageUrl;

    @Size(max = 100, message = "Text nút tối đa 100 ký tự")
    @Column(name = "button_text", length = 100)
    private String buttonText;

    @Size(max = 500, message = "Link nút tối đa 500 ký tự")
    @Column(name = "button_link", length = 500)
    private String buttonLink;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
