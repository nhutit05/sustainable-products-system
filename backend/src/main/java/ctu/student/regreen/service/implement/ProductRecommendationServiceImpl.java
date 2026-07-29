package ctu.student.regreen.service.implement;

import ctu.student.regreen.dto.response.ProductRecommendation;
import ctu.student.regreen.dto.response.RecommendationResponse;
import ctu.student.regreen.model.Product;
import ctu.student.regreen.model.ProductImage;
import ctu.student.regreen.model.ProductMaterial;
import ctu.student.regreen.repository.ProductImageRepository;
import ctu.student.regreen.repository.ProductMaterialRepository;
import ctu.student.regreen.repository.ProductRepository;
import ctu.student.regreen.service.interfaces.ProductRecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductRecommendationServiceImpl implements ProductRecommendationService {

    private final ProductRepository repository;
    private final ProductMaterialRepository productMaterialRepository;
    private final ProductImageRepository productImageRepository;

    @Override
    public RecommendationResponse getRecommendations(Integer productId, Integer limit) {
        // 1. Lấy thông tin sản phẩm hiện tại
        Product currentProduct = repository.findByIdWithCategory(productId)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại với ID: " + productId));

        // 2. Lấy vật liệu của sản phẩm hiện tại
        List<ProductMaterial> currentMaterials = productMaterialRepository.findByProductIdWithMaterial(productId);
        Set<Integer> currentMaterialIds = currentMaterials.stream()
                .map(pm -> pm.getMaterial().getMaterialId())
                .collect(Collectors.toSet());

        // 3. Lấy ứng viên sản phẩm cùng danh mục
        Integer categoryId = currentProduct.getCategory().getCategoryId();
        List<Product> candidateProducts = repository.findCandidatesForRecommendation(categoryId, productId);

        // Lấy vật liệu cho toàn bộ các ứng viên
        List<Integer> candidateIds = candidateProducts.stream().map(Product::getProductId).collect(Collectors.toList());
        List<ProductMaterial> candidateMaterials = productMaterialRepository.findByProductIdsWithMaterial(candidateIds);

        Map<Integer, Set<Integer>> candidateMaterialMap = candidateMaterials.stream()
                .collect(Collectors.groupingBy(
                        pm -> pm.getProduct().getProductId(),
                        Collectors.mapping(pm -> pm.getMaterial().getMaterialId(), Collectors.toSet())
                ));

        // 4. Sắp xếp danh sách gợi ý theo thuật toán Score
        List<ProductRecommendation> recommendations = candidateProducts.stream()
                .map(candidate -> {
                    Set<Integer> candidateMatIds = candidateMaterialMap.getOrDefault(candidate.getProductId(), Collections.emptySet());

                    float score = calculateSimilarityScore(currentProduct, candidate, currentMaterialIds, candidateMatIds);
                    String reason = determineMatchReason(currentProduct, candidate, currentMaterialIds, candidateMatIds);

                    // Lay hinh anh san pham
                    List<ProductImage> productImages = productImageRepository.findAllByProductProductId(candidate.getProductId());
                    String imageUrl = productImages.stream().findFirst().map(ProductImage::getImageUrl).orElse(null);

                    return new AbstractMap.SimpleEntry<>(candidate, new CandidateInfo(score, reason, imageUrl));
                })
                .sorted((e1, e2) -> Float.compare(e2.getValue().score, e1.getValue().score)) // Sắp xếp giảm dần
                .limit(limit)
                .map(entry -> {
                    Product p = entry.getKey();
                    CandidateInfo info = entry.getValue();

                    return ProductRecommendation.builder()
                            .productId(p.getProductId())
                            .productName(p.getProductName())
                            .productPrice(p.getProductPrice())
                            .productCarbonIndex(p.getProductCarbonIndex())
                            .baseEcoPoints(p.getBaseEcoPoints())
                            .imageUrl(info.imageUrl)
                            .categoryId(p.getCategory().getCategoryId())
                            .categoryName(p.getCategory().getCategoryName())
                            .matchReason(info.reason)
                            .build();
                })
                .collect(Collectors.toList());

        return RecommendationResponse.builder()
                .productId(productId)
                .recommendations(recommendations)
                .build();
    }

    private float calculateSimilarityScore(Product current, Product candidate, Set<Integer> currentMatIds, Set<Integer> candidateMatIds) {
        float score = 50.0f; // Điểm nền do cùng Danh mục

        // Chênh lệch Carbon Index
        if (current.getProductCarbonIndex() != null && candidate.getProductCarbonIndex() != null) {
            float carbonDiff = Math.abs(current.getProductCarbonIndex() - candidate.getProductCarbonIndex());
            score -= (carbonDiff * 10.0f);
        }

        // Đếm số lượng vật liệu trùng lặp
        long commonMaterialsCount = candidateMatIds.stream().filter(currentMatIds::contains).count();
        score += (commonMaterialsCount * 15.0f);

        return score;
    }

    private String determineMatchReason(Product current, Product candidate, Set<Integer> currentMatIds, Set<Integer> candidateMatIds) {
        long commonMaterialsCount = candidateMatIds.stream().filter(currentMatIds::contains).count();

        if (commonMaterialsCount > 0) {
            return "Cùng chất liệu tái chế";
        }
        if (current.getProductCarbonIndex() != null && candidate.getProductCarbonIndex() != null) {
            if (Math.abs(current.getProductCarbonIndex() - candidate.getProductCarbonIndex()) <= 0.5f) {
                return "Tác động Carbon tương đồng";
            }
        }
        return "Cùng danh mục " + current.getCategory().getCategoryName();
    }

    private static class CandidateInfo {
        float score;
        String reason;
        String imageUrl;
        CandidateInfo(float score, String reason, String imageUrl) {
            this.score = score;
            this.reason = reason;
            this.imageUrl = imageUrl;
        }
    }
}
