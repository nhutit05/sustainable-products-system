package ctu.student.regreen.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Entity
@Table(name = "products")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString(exclude = {"category", "file"})
public class Product {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Integer productId;

    @NotBlank(message = "Tên sản phẩm không được trống")
    @Size(max = 150, message = "Tên sản phẩm tối đa 150 ký tự")
    @Column(nullable = false, length = 150, name = "product_name")
    private String productName;

    @NotNull(message = "Giá sản phẩm không được trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá sản phẩm phải lớn hơn 0")
    @Column(nullable = false, name = "product_price")
    private Float productPrice;

    @NotNull(message = "Chỉ số carbon của sản phẩm không được trống")
    @PositiveOrZero(message = "Chỉ số carbon không được âm")
    @Column(nullable = false, name = "product_carbon_index")
    private Float productCarbonIndex;

    @NotNull(message = "Số điểm xanh cơ bản không được trống")
    @PositiveOrZero(message = "Số điểm xanh cơ bản không được âm")
    @Column(nullable = false, name = "base_eco_points")
    private Integer baseEcoPoints;

    @NotNull(message = "Số lượng tồn kho không được trống")
    @PositiveOrZero(message = "Số lượng tồn kho không được âm")
    @Column(nullable = false, name = "inventory")
    private Integer inventory;

    @Size(max = 255, message = "Xuất xứ tối đa 255 ký tự")
    @Column(name = "original", length = 255)
    private String original;

    @NotNull(message = "Trạng thái sale không được trống")
    @Column(nullable = false, name = "status_sale")
    private Boolean statusSale;

    @NotNull(message = "Ngày hết hạn không được trống")
    @FutureOrPresent(message = "Ngày hết hạn phải từ hôm nay trở đi")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    @Column(nullable = false, name = "expired_at")
    private LocalDate expiredAt;

    @Positive(message = "Khối lượng phải lớn hơn 0")
    @Column(name = "weight")
    private Float weight;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    // @NotNull(message = "Danh mục không được trống")
    private Category category;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "file_id", nullable = false)
    private File file;
}
