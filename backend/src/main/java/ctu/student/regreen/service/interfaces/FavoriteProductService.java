package ctu.student.regreen.service.interfaces;

import ctu.student.regreen.dto.request.FavoriteProductRequest;
import ctu.student.regreen.dto.response.FavoriteProductResponse;

import java.util.List;

public interface FavoriteProductService {

    List<FavoriteProductResponse> getAll();

    List<FavoriteProductResponse> getAllByUserId(Integer userId);

    List<FavoriteProductResponse> getAllByProductId(Integer productId);

    FavoriteProductResponse getByUserIdAndProductId(Integer userId, Integer productId);

    FavoriteProductResponse create(FavoriteProductRequest request);

    FavoriteProductResponse update(Integer userId, Integer productId, FavoriteProductRequest request);

    Boolean delete(Integer userId, Integer productId);
}
