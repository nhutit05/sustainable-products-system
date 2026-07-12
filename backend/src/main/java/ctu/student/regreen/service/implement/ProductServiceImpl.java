package ctu.student.regreen.service.implement;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import ctu.student.regreen.dto.request.ProductMaterialRequest;
import ctu.student.regreen.dto.response.ProductImageResponse;
import ctu.student.regreen.dto.response.ProductMaterialResponse;
import ctu.student.regreen.mapper.ProductMaterialMapper;
import ctu.student.regreen.model.*;
import ctu.student.regreen.repository.*;
import ctu.student.regreen.service.interfaces.ProductImageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ctu.student.regreen.dto.request.ProductRequest;
import ctu.student.regreen.dto.response.ProductResponse;
import ctu.student.regreen.mapper.ProductMapper;
import ctu.student.regreen.service.interfaces.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductMapper mapper;
    private final ProductRepository repository;

    private final CategoryRepository categoryRepository;

    private final MaterialRepository materialRepository;

    private final ProductMaterialRepository productMaterialRepository;
    private final ProductMaterialMapper productMaterialMapper;

    private final ProductImageService productImageService;
    private final ProductImageRepository productImageRepository;


    @Override
    public ProductResponse create(ProductRequest request) {

        // Tim kiem category da co trong database, neu khong co thi throw exception
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        System.out.println("category: " + category);

        // Tao product
        Product product = mapper.toEntity(request, category);

        repository.save(product);

        List<ProductMaterialResponse> materials = new ArrayList<ProductMaterialResponse>();

        // Tao phan tram nguyen lieu cung cap vao
        for (int i = 0; i < request.getMaterialIds().size(); i++) {
            Integer materialId = request.getMaterialIds().get(i);
            Float percentage = request.getPercentageMaterialIds().get(i);

            // Luu vao bang product_material
            ProductMaterialRequest productMaterialRequest = new ProductMaterialRequest();
            productMaterialRequest.setProductId(product.getProductId());
            productMaterialRequest.setMaterialId(materialId);
            productMaterialRequest.setPercentage(percentage);

            Material material = materialRepository.findById(materialId)
                    .orElseThrow(() ->
                            new RuntimeException("Material not found"));

            System.out.println(material);

            ProductMaterial productMaterial = productMaterialMapper.toEntity(productMaterialRequest, product, material);

            // Them vao danh sach product_material
            productMaterialRepository.save(productMaterial);

            // Them vao danh sach nguyen lieu tra ve
            materials.add(productMaterialMapper.toResponse(productMaterial));
        }

        // Tao danh sach hinh anh cho product
        List<String> imageResponses = new ArrayList<String>();
        for(MultipartFile imageFile : request.getImagesFiles()) {
            ProductImageResponse response = productImageService.createProductImage(product.getProductId(), imageFile);
            imageResponses.add(response.getImageUrl());
        }

        System.out.println("imageResponses: " + imageResponses);

        System.out.println(materials);

        return new ProductResponse(
                product.getProductId(),
                product.getProductName(),
                product.getProductPrice(),
                product.getProductCarbonIndex(),
                product.getBaseEcoPoints(),
                product.getInventory(),
                product.getOriginal(),
                product.getStatusSale(),
                product.getExpiredAt(),
                product.getWeight(),
                category.getCategoryId(),
                category.getCategoryName(),
                materials,
                imageResponses
        );
    }

    @Override
    public ProductResponse update(Integer id, ProductRequest request) {
        Product product = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        // Lay loai san pham
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        // Danh sach nguyen lieu cua product
        List<ProductMaterialResponse> productMaterials = productMaterialRepository.findAllByProductProductId(id)
                .stream()
                .map(productMaterialMapper::toResponse)
                .toList();

        // Danh sach hinh anh cua product
        List<ProductImageResponse> images = productImageService.getAllProductImagesByProductId(id);

        // Cap nhat thong tin product & category
        mapper.update(request, product, category);

        // Xoa toan bo danh sach nguyen lieu cu cua product
        productMaterialRepository.deleteAllByProductProductId(id);

        List<ProductMaterialResponse> productMaterialsNew = new ArrayList<>();

        if (request.getMaterialIds() != null && !request.getMaterialIds().isEmpty()) {

            for (int i = 0; i < request.getMaterialIds().size(); i++) {

                Integer materialId = request.getMaterialIds().get(i);
                Float percentage = request.getPercentageMaterialIds().get(i);

                Material material = materialRepository.findById(materialId)
                        .orElseThrow(() -> new RuntimeException("Material not found"));

                ProductMaterial productMaterial = new ProductMaterial();

                // Tao EmbeddedId cho ProductMaterial
                ProductMaterialId productMaterialId =
                        new ProductMaterialId(product.getProductId(), material.getMaterialId());

                productMaterial.setId(productMaterialId);
                productMaterial.setProduct(product);
                productMaterial.setMaterial(material);
                productMaterial.setPercentage(percentage);

                productMaterialRepository.save(productMaterial);

                productMaterialsNew.add(productMaterialMapper.toResponse(productMaterial));
            }
        }

//        // Cap nhat danh sach nguyen lieu cua product
//        for (int i = 0; i < request.getMaterialIds().size(); i++) {
//            // Lay thong tin nguyen lieu tu request
//            Integer materialId = request.getMaterialIds().get(i);
//            Float percentage = request.getPercentageMaterialIds().get(i);
//
//            // Lay thong tin nguyen lieu tu database
//            Material material = materialRepository.findById(materialId)
//                    .orElseThrow(() ->
//                            new RuntimeException("Material not found"));
//
//            // Lay thong tin product_material tu database
//            ProductMaterial productMaterial = productMaterialRepository.findByProductProductIdAndMaterialMaterialId(id, materialId)
//                    .orElseThrow(() ->
//                            new RuntimeException("ProductMaterial not found"));
//
//
//            // Cap nhat thong tin product_material
//            productMaterial.setPercentage(percentage);
//
//            productMaterialRepository.save(productMaterial);
//        }

        // Cap nhat danh sach hinh anh cua product
        for (MultipartFile imageFile : request.getImagesFiles()) {
            // Gui file moi thi tao anh
            ProductImageResponse response = productImageService.createProductImage(product.getProductId(), imageFile);
            images.add(response);
        }

        return new ProductResponse(
                product.getProductId(),
                product.getProductName(),
                product.getProductPrice(),
                product.getProductCarbonIndex(),
                product.getBaseEcoPoints(),
                product.getInventory(),
                product.getOriginal(),
                product.getStatusSale(),
                product.getExpiredAt(),
                product.getWeight(),

                category.getCategoryId(),
                category.getCategoryName(),

                productMaterials,

                images.stream().map(ProductImageResponse::getImageUrl).toList()
        );
    }

    @Override
    public ProductResponse getById(Integer id) {

        Product product = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        // Danh sach nguyen lieu cua product
        List<ProductMaterialResponse> productMaterials = productMaterialRepository.findAllByProductProductId(product.getProductId())
                .stream()
                .map(productMaterialMapper::toResponse)
                .toList();

        // Lay danh sach imageURL cua product
        List<String> productImages = productImageService.getAllProductImagesByProductId(product.getProductId())
                .stream()
                .map(productImageResponse -> productImageResponse.getImageUrl())
                .toList();

        return new ProductResponse(
                product.getProductId(),
                product.getProductName(),
                product.getProductPrice(),
                product.getProductCarbonIndex(),
                product.getBaseEcoPoints(),
                product.getInventory(),
                product.getOriginal(),
                product.getStatusSale(),
                product.getExpiredAt(),
                product.getWeight(),

                product.getCategory().getCategoryId(),
                product.getCategory().getCategoryName(),

                productMaterials,

                productImages
        );
    }

    @Override
    public List<ProductResponse> getAll() {
        // 1. Lấy toàn bộ sản phẩm
        List<Product> products = repository.findAll();
        if (products.isEmpty()) {
            return new ArrayList<>();
        }

        // 2. Gom tất cả Product ID lại thành một danh sách
        List<Integer> productIds = products
                .stream()
                .map(Product::getProductId)
                .toList();

        // Lấy TOÀN BỘ Materials
        List<ProductMaterial> allMaterials = productMaterialRepository.findAllByProductProductIdIn(productIds);
        // Nhóm lại theo ProductId
        Map<Integer, List<ProductMaterialResponse>> materialsMap = allMaterials.stream()
                .collect(Collectors.groupingBy(
                        pm -> pm.getProduct().getProductId(),
                        Collectors.mapping(productMaterialMapper::toResponse, Collectors.toList())
                ));

        // 4. Lấy TOÀN BỘ Images của tất cả products
        List<ProductImage> allImages = productImageRepository.findAllByProductProductIdIn(productIds);
        Map<Integer, List<String>> imagesMap = allImages.stream()
                .collect(Collectors.groupingBy(
                        pi -> pi.getProduct().getProductId(),
                        Collectors.mapping(ProductImage::getImageUrl, Collectors.toList())
                ));

        // 5. Map dữ liệu lại với nhau
        return products.stream().map(product -> {
            Integer productId = product.getProductId();

            // Lấy từ Map ra, nếu không có thì trả về list rỗng tránh NullPointerException
            List<ProductMaterialResponse> productMaterials = materialsMap.getOrDefault(productId, List.of());
            List<String> productImages = imagesMap.getOrDefault(productId, List.of());

            return new ProductResponse(
                    product.getProductId(),
                    product.getProductName(),
                    product.getProductPrice(),
                    product.getProductCarbonIndex(),
                    product.getBaseEcoPoints(),
                    product.getInventory(),
                    product.getOriginal(),
                    product.getStatusSale(),
                    product.getExpiredAt(),
                    product.getWeight(),

                    product.getCategory().getCategoryId(),
                    product.getCategory().getCategoryName(),

                    productMaterials,
                    productImages
            );
        }).toList();
    }

    @Override
    public Boolean delete(Integer id) {

        try {
            Product product = repository.findById(id)
                    .orElseThrow(() ->
                            new RuntimeException("Product not found"));

            // xoa toan bo anh
            productImageRepository.deleteAllByProductProductId(product.getProductId());

            // Xoa toan bo nguyen lieu trong product_material
            productMaterialRepository.deleteAllByProductProductId(product.getProductId());

            // Xoa Product
            repository.delete(product);

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}