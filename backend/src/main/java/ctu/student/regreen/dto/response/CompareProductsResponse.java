package ctu.student.regreen.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CompareProductsResponse {
    private List<CompareProductsHeader> products;
    private List<CompareSection> sections;
}
