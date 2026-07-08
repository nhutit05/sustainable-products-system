package ctu.student.regreen.service.implement;

import java.util.ArrayList;
import java.util.List;

import ctu.student.regreen.dto.request.ProductMaterialRequest;
import ctu.student.regreen.dto.response.MaterialResponse;
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

        System.out.println("product: " + product);

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
        return null;
//
//        Product product = repository.findById(id)
//                .orElseThrow(() ->
//                        new RuntimeException("Product not found"));
//
//        Category category = categoryRepository.findById(request.getCategoryId())
//                .orElseThrow(() ->
//                        new RuntimeException("Category not found"));
////
////        File file = fileRepository.findById(request.getFileId())
////                .orElseThrow(() ->
////                        new RuntimeException("File not found"));
//
////        mapper.update(product, request, category, file);
//
//        return mapper.toResponse(product);
    }

    @Override
    public ProductResponse getById(Integer id) {

//        Product product = repository.findById(id)
//                .orElseThrow(() ->
//                        new RuntimeException("Product not found"));
//
//        return mapper.toResponse(product);

        return null;
    }

    @Override
    public List<ProductResponse> getAll() {

//        return repository.findAll()
//                .stream()
//                .map(mapper::toResponse)
//                .toList();

        return null;
    }

    @Override
    public void delete(Integer id) {

        Product product = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        repository.delete(product);
    }
}