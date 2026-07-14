package ctu.student.regreen.service.implement;

import ctu.student.regreen.dto.request.ProductMaterialRequest;
import ctu.student.regreen.dto.response.ProductMaterialResponse;
import ctu.student.regreen.mapper.ProductMaterialMapper;
import ctu.student.regreen.model.Material;
import ctu.student.regreen.model.Product;
import ctu.student.regreen.model.ProductMaterial;
import ctu.student.regreen.repository.MaterialRepository;
import ctu.student.regreen.repository.ProductMaterialRepository;
import ctu.student.regreen.repository.ProductRepository;
import ctu.student.regreen.service.interfaces.ProductMaterialService;
// import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductMaterialServiceImpl implements ProductMaterialService {

    private final ProductMaterialRepository repository;

    private final ProductRepository productRepository;

    private final MaterialRepository materialRepository;

    private final ProductMaterialMapper mapper;

    @Override
    public List<ProductMaterialResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public List<ProductMaterialResponse> getAllByMaterialId(Integer materialId) {
        return repository.findAllByMaterialMaterialId(materialId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public List<ProductMaterialResponse> getAllByProductId(Integer productId) {
        return repository.findAllByProductProductId(productId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    public ProductMaterialResponse getByProductIdAndMaterialId(Integer productId, Integer materialId) {
        ProductMaterial entity = repository.findByProductProductIdAndMaterialMaterialId(
                productId,
                materialId)
                .orElseThrow(() -> new RuntimeException("ProductMaterial not found"));

        return mapper.toResponse(entity);
    }

    @Override
    @Transactional
    public ProductMaterialResponse create(ProductMaterialRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Material material = materialRepository.findById(request.getMaterialId())
                .orElseThrow(() -> new RuntimeException("Material not found"));

        ProductMaterial entity = mapper.toEntity(request, product, material);

        return mapper.toResponse(repository.save(entity));
    }

    @Override
    @Transactional
    public ProductMaterialResponse update(Integer productId, Integer materialId, ProductMaterialRequest request) {
        ProductMaterial entity = repository.findByProductProductIdAndMaterialMaterialId(
                productId,
                materialId)
                .orElseThrow(() -> new RuntimeException("ProductMaterial not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Material material = materialRepository.findById(request.getMaterialId())
                .orElseThrow(() -> new RuntimeException("Material not found"));

        mapper.update(entity, request, product, material);

        return mapper.toResponse(repository.save(entity));
    }

    @Transactional
    public Boolean deleteByProductIdAndMaterialId(Integer productId, Integer materialId) {
        repository.deleteByProductProductIdAndMaterialMaterialId(productId, materialId)
                .orElseThrow(() -> new RuntimeException("ProductMaterial not found"));

        return true;
    }
}
