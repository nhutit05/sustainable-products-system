package ctu.student.regreen.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class CompareProductsRequest {
    List<Integer> productIds;
}
