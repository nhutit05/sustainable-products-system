package ctu.student.regreen.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Entity
@Table(name = "products")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Product {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    @Column(name = "product_id", nullable = false, updatable = false)
    private Integer productId;

    @NotBlank(message = "Tên sản phẩm không được trống")
    @Size(max = 150, message = "Tên sản phẩm tối đa 150 ký tự")
    @Column(name = "product_name", nullable = false)
    private String productName;

    @NotNull(message = "Giá sản phẩm không được trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá sản phẩm phải lớn hơn 0")
    @Column(name = "product_price", nullable = false)
    private Float productPrice;

    @NotNull(message = "Chỉ số carbon của sản phẩm không được trống")
    @PositiveOrZero(message = "Chỉ số carbon không được âm")
    @Column(name = "product_carbon_index", nullable = false)
    private Float productCarbonIndex;

    @NotNull(message = "Số điểm xanh cơ bản không được trống")
    @PositiveOrZero(message = "Số điểm xanh cơ bản không được âm")
    @Column(name = "base_eco_points", nullable = false)
    private Integer baseEcoPoints;

    @NotNull(message = "Số lượng tồn kho không được trống")
    @PositiveOrZero(message = "Số lượng tồn kho không được âm")
    @Column(name = "inventory", nullable = false)
    private Integer inventory;

    @Size(max = 255, message = "Xuất xứ tối đa 255 ký tự")
    private String original;

    @NotNull(message = "Trạng thái sale không được trống")
    @Column(name = "status_sale", nullable = false)
    private Boolean statusSale;

    @NotNull(message = "Ngày hết hạn không được trống")
    @FutureOrPresent(message = "Ngày hết hạn phải từ hôm nay trở đi")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    @Column(name = "expired_at", nullable = false)
    private LocalDate expiredAt;

    @Positive(message = "Khối lượng phải lớn hơn 0")
    private Float weight;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    @NotNull(message = "Danh mục không được trống")
    private Category category;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "file_id", nullable = false)
    private File file;
}
