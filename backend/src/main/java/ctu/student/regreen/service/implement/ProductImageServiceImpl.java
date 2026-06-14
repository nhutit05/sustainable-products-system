package ctu.student.regreen.service.implement;

import ctu.student.regreen.dto.request.ProductImageRequest;
import ctu.student.regreen.dto.response.ProductImageResponse;
import ctu.student.regreen.mapper.ProductImageMapper;
import ctu.student.regreen.model.Product;
import ctu.student.regreen.model.ProductImage;
import ctu.student.regreen.repository.ProductImageRepository;
import ctu.student.regreen.repository.ProductRepository;
import ctu.student.regreen.service.interfaces.ProductImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductImageServiceImpl implements ProductImageService {

    private final ProductImageRepository repository;
    private final ProductRepository productRepository;

    private final ProductImageMapper mapper;

    public ProductImageResponse createProductImage(ProductImageRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        ProductImage productImage = mapper.toEntity(request, product);
        return mapper.toResponse(repository.save(productImage));
    }

    @Override
    public List<ProductImageResponse> getAllProductImagesByProductId(Integer productId) {
        return repository.findAllByProductProductId(productId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public ProductImageResponse getByProductImageIdAndProductId(Integer productImageId, Integer productId) {
        ProductImage productImage = repository.findByProductImageIdAndProductProductId(
                productImageId,
                productId)
                .orElseThrow(() ->
                        new RuntimeException("Product image not found"));
        return mapper.toResponse(productImage);
    }

    @Override
    public ProductImageResponse updateProductImage(Integer productImageId, Integer productId, ProductImageRequest request) {
        ProductImage existingProductImage = repository.findByProductImageIdAndProductProductId(
                productImageId,
                productId)
                .orElseThrow(() ->
                        new RuntimeException("Product image not found"));

        Product product = productRepository.findById(productId).orElseThrow(() ->
                new RuntimeException("Product not found"));

        mapper.update(existingProductImage, request, product);

        return mapper.toResponse(repository.save(existingProductImage));
    }

    public ProductImageResponse createProductImage(ProductImage productImage) {
        return mapper.toResponse(repository.save(productImage));
    }

    public Boolean deleteByProductImageIdAndProductId(Integer productImageId, Integer productId) {
        repository.deleteByProductImageIdAndProductProductId(productImageId, productId)
                .orElseThrow(() ->
                        new RuntimeException("Product image not found"));
        return true;
    }
}
