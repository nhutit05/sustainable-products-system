package ctu.student.regreen.dto.response;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProductResponse {

    private Integer productId;

    private String productName;

    private Float productPrice;

    private Float productCarbonIndex;

    private Integer baseEcoPoints;

    private Integer inventory;

    private String original;

    private Boolean statusSale;

    private LocalDate expiredAt;

    private Float weight;

    private Integer categoryId;

    private String categoryName;

    private Integer fileId;
}