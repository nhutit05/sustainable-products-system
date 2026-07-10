package ctu.student.regreen.service.interfaces;

import java.util.List;

import ctu.student.regreen.dto.request.ProductRequest;
import ctu.student.regreen.dto.response.ProductResponse;

public interface ProductService {

    ProductResponse create(ProductRequest request);

    ProductResponse update(
            Integer id,
            ProductRequest request);

    ProductResponse getById(Integer id);

    List<ProductResponse> getAll();

    Boolean delete(Integer id);
}