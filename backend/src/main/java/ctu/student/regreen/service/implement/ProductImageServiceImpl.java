package ctu.student.regreen.service.implement;

import ctu.student.regreen.dto.request.ProductImageRequest;
import ctu.student.regreen.dto.response.ProductImageResponse;
import ctu.student.regreen.mapper.ProductImageMapper;
import ctu.student.regreen.model.Product;
import ctu.student.regreen.model.ProductImage;
import ctu.student.regreen.repository.ProductImageRepository;
import ctu.student.regreen.repository.ProductRepository;
import ctu.student.regreen.service.interfaces.CloudinaryService;
import ctu.student.regreen.service.interfaces.ProductImageService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProductImageServiceImpl implements ProductImageService {

    private final CloudinaryService cloudinaryService;

    private final ProductImageRepository repository;
    private final ProductRepository productRepository;

    private final ProductImageMapper mapper;

    @Transactional
    public ProductImageResponse createProductImage(Integer productId, MultipartFile file) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        Map upload = cloudinaryService.uploadImage(file);
        String imageUrl = (String) upload.get("url");
        ProductImageRequest request = new ProductImageRequest(imageUrl);
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
    public ProductImageResponse updateProductImage(Integer productImageId,
                                                   Integer productId,
                                                   MultipartFile image) {
        ProductImage existingProductImage = repository.findByProductImageIdAndProductProductId(
                productImageId,
                productId)
                .orElseThrow(() ->
                        new RuntimeException("Product image not found"));

        Product product = productRepository.findById(productId).orElseThrow(() ->
                new RuntimeException("Product not found"));

        Map upload = cloudinaryService.uploadImage(image);
        String imageUrl = (String) upload.get("url");
        ProductImageRequest request = new ProductImageRequest(imageUrl);

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
