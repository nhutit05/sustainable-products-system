package ctu.student.regreen.dto.request;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ProductRequest {

    @NotBlank
    @Size(max = 150)
    private String productName;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private Float productPrice;

    @NotNull
    @PositiveOrZero
    private Float productCarbonIndex;

    @NotNull
    @PositiveOrZero
    private Integer baseEcoPoints;

    @NotNull
    @PositiveOrZero
    private Integer inventory;

    @Size(max = 255)
    private String original;

    @NotNull
    private Boolean statusSale;

    @NotNull
    @FutureOrPresent
    private LocalDate expiredAt;

    @Positive
    private Float weight;

    @NotNull
    private Integer categoryId;

    private List<Integer> materialIds;

    private List<Float> percentageMaterialIds;

    @JsonIgnore
    private List<MultipartFile> imagesFiles;
}