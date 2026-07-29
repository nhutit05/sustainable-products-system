package ctu.student.regreen.service.implement;

import ctu.student.regreen.dto.response.*;
import ctu.student.regreen.mapper.ProductMaterialMapper;
import ctu.student.regreen.model.Product;
import ctu.student.regreen.model.ProductImage;
import ctu.student.regreen.model.ProductMaterial;
import ctu.student.regreen.repository.ProductImageRepository;
import ctu.student.regreen.repository.ProductMaterialRepository;
import ctu.student.regreen.repository.ProductRepository;
import ctu.student.regreen.service.interfaces.CompareProductsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompareProductsServiceImpl implements CompareProductsService {

    private final ProductRepository repository;
    private final ProductMaterialRepository productMaterialRepository;
    private final ProductMaterialMapper productMaterialMapper;
    private final ProductImageRepository productImageRepository;

    @Override
    public CompareProductsResponse compareProducts(List<Integer> productIds) {
        // 1. Giới hạn số lượng sản phẩm so sánh (Tối đa 4 sản phẩm để tối ưu giao diện)
        if (productIds.size() > 4) {
            throw new IllegalArgumentException("Chỉ được so sánh tối đa 4 sản phẩm cùng lúc.");
        }

        // 2. Query danh sách sản phẩm từ DB kèm theo Materials (dùng JOIN FETCH trong Repo để tránh N+1)
        List<ProductMaterialResponse> materials = new ArrayList<>(); // Initialize materials to null

        List<CompareProductsHeader> productHeaders = new ArrayList<>();

        List<Product> products = new ArrayList<>();
        for(Integer productId : productIds) {
            Product product = repository.findById(productId)
                    .orElseThrow(() -> new IllegalArgumentException("Sản phẩm không tồn tại."));

            products.add(product);
            // Tim hinh anh cho san pham
            List<ProductImage> productImages = productImageRepository.findAllByProductProductId(productId);
            String imageUrl = productImages.stream().findFirst()
                    .map(ProductImage::getImageUrl)
                    .orElse(null);
            // Build phần Header sản phẩm
            productHeaders.add(CompareProductsHeader.builder()
                    .productId(product.getProductId())
                    .productName(product.getProductName())
                    .productPrice(product.getProductPrice())
                    .productCarbonIndex(product.getProductCarbonIndex())
                    .baseEcoPoints(product.getBaseEcoPoints())
                    .imageUrl(imageUrl)
                    .build());

            // Build phan Section
            List<CompareSection> sections = new ArrayList<>();
            sections.add(buildEcoSection(Collections.singletonList(product), materials));
            sections.add(buildTechnicalSection(Collections.singletonList(product)));

            // Truy van danh sach theo product
            List<ProductMaterialResponse> productMaterialResponses = productMaterialRepository.findAllByProductProductId(productId).stream()
                    .map(productMaterialMapper::toResponse)
                    .toList();
            materials.addAll(productMaterialResponses);
        }


        // 4. Build phần Sections
        List<CompareSection> sections = new ArrayList<>();
        sections.add(buildEcoSection(products, materials));
        sections.add(buildTechnicalSection(products));

        return CompareProductsResponse.builder()
                .products(productHeaders)
                .sections(sections)
                .build();
    }

    @Override
    public CompareSection buildEcoSection(List<Product> products, List<ProductMaterialResponse> materials) {
        List<AttributeRow> attributes = new ArrayList<>();

        // Attribute: Chỉ số Carbon (Càng thấp càng tốt)
        Map<String, String> carbonValues = new HashMap<>();
        Integer minCarbonProductId = null;
        Float minCarbon = Float.MAX_VALUE;

        for (Product p : products) {
            String pIdStr = String.valueOf(p.getProductId());
            carbonValues.put(pIdStr, String.valueOf(p.getProductCarbonIndex()));

            if (p.getProductCarbonIndex() != null && p.getProductCarbonIndex() < minCarbon) {
                minCarbon = p.getProductCarbonIndex();
                minCarbonProductId = p.getProductId();
            }
        }

        attributes.add(AttributeRow.builder()
                .key("productCarbonIndex")
                .label("Chỉ số Carbon")
                .values(carbonValues)
                .highlightedValue(minCarbonProductId != null ? String.valueOf(minCarbonProductId) : null)
                .build());

        // Attribute: Điểm Eco (Càng cao càng tốt)
        Map<String, String> ecoPointValues = new HashMap<>();
        Integer maxPointProductId = null;
        Integer maxPoint = -1;

        for (Product p : products) {
            String pIdStr = String.valueOf(p.getProductId());
            ecoPointValues.put(pIdStr, p.getBaseEcoPoints() + " điểm");

            if (p.getBaseEcoPoints() != null && p.getBaseEcoPoints() > maxPoint) {
                maxPoint = p.getBaseEcoPoints();
                maxPointProductId = p.getProductId();
            }
        }

        attributes.add(AttributeRow.builder()
                .key("baseEcoPoints")
                .label("Điểm Eco tích lũy")
                .values(ecoPointValues)
                .highlightedValue(maxPointProductId != null ? String.valueOf(maxPointProductId) : null)
                .build());

        // Attribute: Vật liệu tái chế (Gộp chuỗi)
        Map<String, String> materialValues = new HashMap<>();
        for (ProductMaterialResponse pms : materials) {
            String materialsStr = pms.getMaterialName() + " (" + pms.getPercentage() + "%)";
            materialValues.put(String.valueOf(pms.getProductId()), materialsStr);
        }

        attributes.add(AttributeRow.builder()
                .key("materials")
                .label("Thành phần vật liệu")
                .values(materialValues)
                .build());

        return CompareSection.builder()
                .sectionName("Chỉ số Bền vững (Eco)")
                .attributes(attributes)
                .build();
    }

    @Override
    public CompareSection buildTechnicalSection(List<Product> products) {
        List<AttributeRow> attributes = new ArrayList<>();

        Map<String, String> categoryValues = new HashMap<>();
        Map<String, String> weightValues = new HashMap<>();
        Map<String, String> originValues = new HashMap<>();

        for (Product p : products) {
            String pIdStr = String.valueOf(p.getProductId());
            categoryValues.put(pIdStr, p.getCategory().getCategoryName());
            weightValues.put(pIdStr, p.getWeight() + " kg");
            originValues.put(pIdStr, p.getOriginal());
        }

        attributes.add(AttributeRow.builder().key("categoryName").label("Danh mục").values(categoryValues).build());
        attributes.add(AttributeRow.builder().key("weight").label("Trọng lượng").values(weightValues).build());
        attributes.add(AttributeRow.builder().key("original").label("Xuất xứ").values(originValues).build());

        return CompareSection.builder()
                .sectionName("Thông số Kỹ thuật")
                .attributes(attributes)
                .build();
    }
}
