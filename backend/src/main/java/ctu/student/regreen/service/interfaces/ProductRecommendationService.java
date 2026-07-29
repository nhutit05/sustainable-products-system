package ctu.student.regreen.service.interfaces;

import ctu.student.regreen.dto.response.RecommendationResponse;

public interface ProductRecommendationService {

    RecommendationResponse getRecommendations(Integer productId, Integer limit);
}
