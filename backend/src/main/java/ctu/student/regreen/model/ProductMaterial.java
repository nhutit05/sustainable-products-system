package ctu.student.regreen.model;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "product_materials")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductMaterial {

    @EmbeddedId
    private ProductMaterialId id;

    @MapsId("product_id")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @MapsId("material_id")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;

    @NotNull(message = "Tỷ lệ phần trăm không được trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Tỷ lệ phần trăm phải lớn hơn 0")
    @DecimalMax(value = "100.0", inclusive = true, message = "Tỷ lệ phần trăm không được vượt quá 100")
    @Column(nullable = false)
    private Float percentage; // Tỷ lệ phần trăm của vật liệu trong sản phẩm
}
