package ctu.student.regreen.service.implement;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ctu.student.regreen.dto.request.ProductRequest;
import ctu.student.regreen.dto.response.ProductResponse;
import ctu.student.regreen.mapper.ProductMapper;
import ctu.student.regreen.model.Category;
import ctu.student.regreen.model.File;
import ctu.student.regreen.model.Product;
import ctu.student.regreen.repository.CategoryRepository;
import ctu.student.regreen.repository.FileRepository;
import ctu.student.regreen.repository.ProductRepository;
import ctu.student.regreen.service.interfaces.ProductService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository repository;
    private final CategoryRepository categoryRepository;
    private final FileRepository fileRepository;
    private final ProductMapper mapper;

    @Override
    public ProductResponse create(ProductRequest request) {

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        File file = fileRepository.findById(request.getFileId())
                .orElseThrow(() ->
                        new RuntimeException("File not found"));

        Product product = mapper.toEntity(request, category, file);

        return mapper.toResponse(repository.save(product));
    }

    @Override
    public ProductResponse update(Integer id, ProductRequest request) {

        Product product = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        File file = fileRepository.findById(request.getFileId())
                .orElseThrow(() ->
                        new RuntimeException("File not found"));

        mapper.update(product, request, category, file);

        return mapper.toResponse(product);
    }

    @Override
    public ProductResponse getById(Integer id) {

        Product product = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        return mapper.toResponse(product);
    }

    @Override
    public List<ProductResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public void delete(Integer id) {

        Product product = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        repository.delete(product);
    }
}