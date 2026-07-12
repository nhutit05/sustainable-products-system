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
        System.out.println("product: " + product);

        // Lay loai san pham
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        System.out.println(category);

        // Cap nhat thong tin product & category
        mapper.update(request, product, category);

        System.out.println("product after update: " + product);

        // Danh sach nguyen lieu hien tai cua product
        List<ProductMaterialResponse> productMaterialsExist = productMaterialRepository.findAllByProductProductId(id)
                .stream()
                .map(productMaterialMapper::toResponse)
                .toList();

        List <ProductMaterialResponse> productMaterials = new ArrayList<ProductMaterialResponse>();

        // Cap nhat thong tin nguyen lieu
        if (request.getMaterialIds().toArray().length != productMaterialsExist.toArray().length) {

            // Xoa toan bo nguyen lieu cu cua product
            productMaterialRepository.deleteByProductId(id);

            for(int i=0; i<request.getMaterialIds().size(); i++) {
                // kiem tra xem nguyen lieu co ton tai trong database hay khong
                Material material = materialRepository.findById(request.getMaterialIds().get(i))
                        .orElseThrow(() -> new RuntimeException("update: Material not found"));

                // Them nguyen lieu moi vao danh sach nguyen lieu cua product
                ProductMaterialId embeddedId = new ProductMaterialId(product.getProductId(), material.getMaterialId());

                // Tao ProductMaterial moi
                ProductMaterial productMaterial = new ProductMaterial();

                productMaterial.setId(embeddedId);
                productMaterial.setProduct(product);
                productMaterial.setMaterial(material);
                productMaterial.setPercentage(request.getPercentageMaterialIds().get(i));

                // Luu vao database
                productMaterials.add(productMaterialMapper.toResponse(productMaterialRepository.save(productMaterial)));
            }
        }

        if(!request.getImagesFiles().isEmpty()) {
            for (MultipartFile imageFile : request.getImagesFiles()) {
                // Gui file moi thi tao anh
                ProductImageResponse response = productImageService.createProductImage(product.getProductId(), imageFile);
            }
        }

        // Danh sach hinh anh hien tai cua product
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

                category.getCategoryId(),
                category.getCategoryName(),

                productMaterials,

                productImages
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
        List<Product> products = repository.findAll()
                .stream()
                .filter(product -> product.getIsDeleted() == null || !product.getIsDeleted()) // Lọc ra những sản phẩm không bị xóa
                .toList();
        if (products.isEmpty()) {
            return new ArrayList<>();
        }

        // 2. Gom tất cả Product ID lại thành một danh sách
        List<Integer> productIds = products
                .stream()
                .filter(product -> product.getIsDeleted() == null || !product.getIsDeleted()) // Lọc ra những sản phẩm không bị xóa
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

            product.setIsDeleted(true);

            repository.save(product);

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public Integer countProducts() {
        return (int) repository.count();
    }
}