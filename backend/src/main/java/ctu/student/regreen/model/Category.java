package ctu.student.regreen.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id", nullable=false, unique = true)
    private Integer categoryId;

    @NotBlank(message = "Tên danh mục không được trống")
    @Size(max = 150, message = "Tên danh mục tối đa 150 ký tự")
    @Column(name = "category_name", nullable = false, unique = true)
    private String categoryName;
}
