package ctu.student.regreen.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.multipart.MultipartFile;

import ctu.student.regreen.dto.request.ProductRequest;
import ctu.student.regreen.dto.response.ProductImageResponse;
import ctu.student.regreen.dto.response.ProductMaterialResponse;
import ctu.student.regreen.dto.response.ProductResponse;
import ctu.student.regreen.mapper.ProductMapper;
import ctu.student.regreen.mapper.ProductMaterialMapper;
import ctu.student.regreen.model.Category;
import ctu.student.regreen.model.Material;
import ctu.student.regreen.model.Product;
import ctu.student.regreen.model.ProductImage;
import ctu.student.regreen.model.ProductMaterial;
import ctu.student.regreen.repository.CategoryRepository;
import ctu.student.regreen.repository.MaterialRepository;
import ctu.student.regreen.repository.ProductImageRepository;
import ctu.student.regreen.repository.ProductMaterialRepository;
import ctu.student.regreen.repository.ProductRepository;
import ctu.student.regreen.service.implement.ProductServiceImpl;
import ctu.student.regreen.service.interfaces.CategoryService;
import ctu.student.regreen.service.interfaces.ProductImageService;

@ExtendWith(MockitoExtension.class)
class ProductServiceImplTest {

    @Mock
    private ProductMapper mapper;

    @Mock
    private ProductRepository repository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private MaterialRepository materialRepository;

    @Mock
    private ProductMaterialRepository productMaterialRepository;

    @Mock
    private ProductMaterialMapper productMaterialMapper;

    @Mock
    private ProductImageService productImageService;

    @Mock
    private ProductImageRepository productImageRepository;

    @Mock
    private CategoryService categoryService;

    @InjectMocks
    private ProductServiceImpl service;

    private Category category;
    private Product product;
    private Material material;
    private ProductMaterial productMaterial;
    private ProductImage productImage;
    private ProductRequest request;
    private ProductMaterialResponse materialResponse;
    private ProductImageResponse imageResponse;
    private ProductResponse productResponse;

    @BeforeEach
    void setUp() {

        category = new Category();
        category.setCategoryId(1);
        category.setCategoryName("Eco");

        product = new Product();
        product.setProductId(1);
        product.setProductName("Bottle");
        product.setProductPrice(100f);
        product.setProductCarbonIndex(5f);
        product.setBaseEcoPoints(10);
        product.setInventory(50);
        product.setOriginal("Vietnam");
        product.setStatusSale(true);
        product.setExpiredAt(LocalDate.of(2027, 1, 1));
        product.setWeight(0.5f);
        product.setIsDeleted(false);
        product.setCategory(category);

        material = new Material();
        material.setMaterialId(1);
        material.setMaterialName("Cotton");

        productMaterial = new ProductMaterial();
        productMaterial.setProduct(product);
        productMaterial.setMaterial(material);
        productMaterial.setPercentage(50f);

        productImage = new ProductImage();
        productImage.setProductImageId(1);
        productImage.setProduct(product);
        productImage.setImageUrl("http://img/1.jpg");

        request = new ProductRequest();
        request.setCategoryId(1);
        request.setMaterialIds(List.of(1));
        request.setPercentageMaterialIds(List.of(50f));
        request.setImagesFiles(new ArrayList<>());

        materialResponse = new ProductMaterialResponse(
                1, "Bottle", 1, "Cotton", 50f);

        imageResponse = new ProductImageResponse(
                1, "http://img/1.jpg", 1);

        productResponse = new ProductResponse(
                1, "Bottle", 100f, 5f, 10, 50, "Vietnam",
                true, LocalDate.of(2027, 1, 1), 0.5f,
                1, "Eco", List.of(materialResponse),
                List.of("http://img/1.jpg"));
    }

    // ==================== CREATE ====================

    @Test
    void create_success() {

        when(categoryRepository.findById(1))
                .thenReturn(Optional.of(category));
        when(mapper.toEntity(request, category))
                .thenReturn(product);
        when(repository.save(product)).thenReturn(product);
        when(materialRepository.findAllById(List.of(1)))
                .thenReturn(List.of(material));

        ProductMaterial pm = new ProductMaterial();
        when(productMaterialMapper.toEntity(
                any(), eq(product), eq(material)))
                .thenReturn(pm);
        when(productMaterialRepository.save(pm)).thenReturn(pm);
        when(productMaterialMapper.toResponse(pm))
                .thenReturn(materialResponse);

        ProductResponse result = service.create(request);

        assertNotNull(result);
        assertEquals(1, result.getProductId());
        assertEquals("Eco", result.getCategoryName());
        assertEquals(1, result.getMaterials().size());
        assertTrue(result.getImageUrls().isEmpty());
        verify(repository).save(product);
        verify(productMaterialRepository).save(pm);
        verify(productImageService, never())
                .createProductImage(anyInt(), any());
    }

    @Test
    void create_withImages() {

        MultipartFile imageFile = mock(MultipartFile.class);
        ProductRequest req = new ProductRequest();
        req.setCategoryId(1);
        req.setMaterialIds(List.of(1));
        req.setPercentageMaterialIds(List.of(50f));
        req.setImagesFiles(List.of(imageFile));

        when(categoryRepository.findById(1))
                .thenReturn(Optional.of(category));
        when(mapper.toEntity(req, category))
                .thenReturn(product);
        when(repository.save(product)).thenReturn(product);
        when(materialRepository.findAllById(List.of(1)))
                .thenReturn(List.of(material));

        ProductMaterial pm = new ProductMaterial();
        when(productMaterialMapper.toEntity(
                any(), eq(product), eq(material)))
                .thenReturn(pm);
        when(productMaterialRepository.save(pm)).thenReturn(pm);
        when(productMaterialMapper.toResponse(pm))
                .thenReturn(materialResponse);
        when(productImageService.createProductImage(1, imageFile))
                .thenReturn(imageResponse);

        ProductResponse result = service.create(req);

        assertNotNull(result);
        assertEquals(1, result.getImageUrls().size());
        assertEquals("http://img/1.jpg",
                result.getImageUrls().get(0));
        verify(productImageService)
                .createProductImage(1, imageFile);
    }

    @Test
    void create_categoryNotFound_fail() {

        when(categoryRepository.findById(1))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.create(request));

        assertEquals("Category not found", ex.getMessage());
    }

    @Test
    void create_materialNotFound_fail() {

        request.setMaterialIds(List.of(99));
        request.setPercentageMaterialIds(List.of(30f));

        when(categoryRepository.findById(1))
                .thenReturn(Optional.of(category));
        when(mapper.toEntity(request, category))
                .thenReturn(product);
        when(repository.save(product)).thenReturn(product);
        when(materialRepository.findAllById(List.of(99)))
                .thenReturn(List.of());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.create(request));

        assertEquals("Material not found: 99",
                ex.getMessage());
    }

    // ==================== UPDATE ====================

    @Test
    void update_success_noImages() {

        when(repository.findById(1))
                .thenReturn(Optional.of(product));
        when(categoryRepository.findById(1))
                .thenReturn(Optional.of(category));
        when(materialRepository.findAllById(List.of(1)))
                .thenReturn(List.of(material));

        ProductMaterial pm = new ProductMaterial();
        when(productMaterialRepository.save(any()))
                .thenReturn(pm);
        when(productMaterialMapper.toResponse(any()))
                .thenReturn(materialResponse);

        ProductImageResponse imgResp = new ProductImageResponse(
                1, "http://img/1.jpg", 1);
        when(productImageService
                .getAllProductImagesByProductId(1))
                .thenReturn(List.of(imgResp));

        ProductResponse result = service.update(1, request);

        assertNotNull(result);
        verify(mapper).update(request, product, category);
        verify(productMaterialRepository).deleteByProductId(1);
        verify(productMaterialRepository).save(any());
        verify(productImageService, never())
                .createProductImage(anyInt(), any());
        verify(productImageService)
                .getAllProductImagesByProductId(1);
    }

    @Test
    void update_success_withImages() {

        MultipartFile imageFile = mock(MultipartFile.class);
        ProductRequest req = new ProductRequest();
        req.setCategoryId(1);
        req.setMaterialIds(List.of(1));
        req.setPercentageMaterialIds(List.of(50f));
        req.setImagesFiles(List.of(imageFile));

        when(repository.findById(1))
                .thenReturn(Optional.of(product));
        when(categoryRepository.findById(1))
                .thenReturn(Optional.of(category));
        when(materialRepository.findAllById(List.of(1)))
                .thenReturn(List.of(material));

        ProductMaterial pm = new ProductMaterial();
        when(productMaterialRepository.save(any()))
                .thenReturn(pm);
        when(productMaterialMapper.toResponse(any()))
                .thenReturn(materialResponse);

        ProductImageResponse imgResp = new ProductImageResponse(
                1, "http://img/new.jpg", 1);
        when(productImageService
                .createProductImage(1, imageFile))
                .thenReturn(imgResp);
        when(productImageService
                .getAllProductImagesByProductId(1))
                .thenReturn(List.of(imgResp));

        ProductResponse result = service.update(1, req);

        assertNotNull(result);
        verify(productImageService)
                .createProductImage(1, imageFile);
        verify(productMaterialRepository).deleteByProductId(1);
    }

    @Test
    void update_productNotFound_fail() {

        when(repository.findById(99))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.update(99, request));

        assertEquals("Product not found", ex.getMessage());
    }

    @Test
    void update_categoryNotFound_fail() {

        when(repository.findById(1))
                .thenReturn(Optional.of(product));
        when(categoryRepository.findById(1))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.update(1, request));

        assertEquals("Category not found", ex.getMessage());
    }

    @Test
    void update_materialNotFound_fail() {

        request.setMaterialIds(List.of(99));
        request.setPercentageMaterialIds(List.of(30f));

        when(repository.findById(1))
                .thenReturn(Optional.of(product));
        when(categoryRepository.findById(1))
                .thenReturn(Optional.of(category));
        when(materialRepository.findAllById(List.of(99)))
                .thenReturn(List.of());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.update(1, request));

        assertEquals("update: Material not found: 99",
                ex.getMessage());
    }

    // ==================== GETBYID ====================

    @Test
    void getById_success() {

        when(repository.findById(1))
                .thenReturn(Optional.of(product));
        when(productMaterialRepository
                .findAllByProductProductId(1))
                .thenReturn(List.of(productMaterial));
        when(productMaterialMapper
                .toResponse(productMaterial))
                .thenReturn(materialResponse);
        when(productImageService
                .getAllProductImagesByProductId(1))
                .thenReturn(List.of(imageResponse));

        ProductResponse result = service.getById(1);

        assertNotNull(result);
        assertEquals(1, result.getProductId());
        assertEquals("Bottle", result.getProductName());
        assertEquals(1, result.getCategoryId());
        assertEquals("Eco", result.getCategoryName());
        assertEquals(1, result.getMaterials().size());
        assertEquals(1, result.getImageUrls().size());
        verify(productMaterialRepository)
                .findAllByProductProductId(1);
        verify(productImageService)
                .getAllProductImagesByProductId(1);
    }

    @Test
    void getById_notFound_fail() {

        when(repository.findById(99))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.getById(99));

        assertEquals("Product not found", ex.getMessage());
    }

    // ==================== GETALL ====================

    @Test
    void getAll_success() {

        when(repository.findAllWithCategory())
                .thenReturn(List.of(product));
        when(productMaterialRepository
                .findAllByProductProductIdIn(List.of(1)))
                .thenReturn(List.of(productMaterial));
        when(productMaterialMapper
                .toResponse(productMaterial))
                .thenReturn(materialResponse);
        when(productImageRepository
                .findAllByProductProductIdIn(List.of(1)))
                .thenReturn(List.of(productImage));

        List<ProductResponse> result = service.getAll();

        assertEquals(1, result.size());
        assertEquals(1, result.get(0).getProductId());
        assertEquals("Eco", result.get(0).getCategoryName());
        assertEquals(1, result.get(0).getMaterials().size());
        assertEquals(1, result.get(0).getImageUrls().size());
    }

    @Test
    void getAll_empty() {

        when(repository.findAllWithCategory())
                .thenReturn(List.of());

        List<ProductResponse> result = service.getAll();

        assertTrue(result.isEmpty());
        verify(productMaterialRepository, never())
                .findAllByProductProductIdIn(any());
        verify(productImageRepository, never())
                .findAllByProductProductIdIn(any());
    }

    @Test
    void getAll_filtersDeleted() {

        Product deletedProduct = new Product();
        deletedProduct.setProductId(2);
        deletedProduct.setIsDeleted(true);
        deletedProduct.setCategory(category);

        when(repository.findAllWithCategory())
                .thenReturn(List.of(product, deletedProduct));
        when(productMaterialRepository
                .findAllByProductProductIdIn(List.of(1)))
                .thenReturn(List.of());
        when(productImageRepository
                .findAllByProductProductIdIn(List.of(1)))
                .thenReturn(List.of());

        List<ProductResponse> result = service.getAll();

        assertEquals(1, result.size());
        assertEquals(1, result.get(0).getProductId());
    }

    // ==================== GETALLFILTERED ====================

    @Test
    void getAllFiltered_success() {

        PageRequest pageable = PageRequest.of(
                0, 10, Sort.by("productId").descending());

        PageImpl<Product> page = new PageImpl<>(
                List.of(product), pageable, 1);

        when(categoryService.getDescendantIds(1))
                .thenReturn(List.of(1));
        when(repository.findAll(
                any(Specification.class), any(Pageable.class)))
                .thenReturn(page);
        when(productMaterialRepository
                .findAllByProductProductIdIn(List.of(1)))
                .thenReturn(List.of(productMaterial));
        when(productMaterialMapper
                .toResponse(productMaterial))
                .thenReturn(materialResponse);
        when(productImageRepository
                .findAllByProductProductIdIn(List.of(1)))
                .thenReturn(List.of(productImage));

        Map<String, Object> result =
                service.getAllFiltered(null, 1, null, 1, 10);

        assertNotNull(result);
        @SuppressWarnings("unchecked")
        List<ProductResponse> data =
                (List<ProductResponse>) result.get("data");
        assertEquals(1, data.size());
        assertEquals(1L, result.get("total"));
        verify(categoryService).getDescendantIds(1);
    }

    @Test
    void getAllFiltered_noCategory() {

        PageRequest pageable = PageRequest.of(
                0, 10, Sort.by("productId").descending());

        PageImpl<Product> page = new PageImpl<>(
                List.of(product), pageable, 1);

        when(repository.findAll(
                any(Specification.class), any(Pageable.class)))
                .thenReturn(page);
        when(productMaterialRepository
                .findAllByProductProductIdIn(List.of(1)))
                .thenReturn(List.of());
        when(productImageRepository
                .findAllByProductProductIdIn(List.of(1)))
                .thenReturn(List.of());

        Map<String, Object> result =
                service.getAllFiltered(null, null, null, 1, 10);

        assertNotNull(result);
        verify(categoryService, never())
                .getDescendantIds(anyInt());
    }

    @Test
    void getAllFiltered_defaultPagination() {

        when(repository.findAll(
                any(Specification.class), any(Pageable.class)))
                .thenReturn(new PageImpl<>(
                        List.of(),
                        PageRequest.of(0, 10,
                                Sort.by("productId")
                                        .descending()),
                        0));

        Map<String, Object> result =
                service.getAllFiltered(null, null, null, null, null);

        assertNotNull(result);
        verify(repository).findAll(
                any(Specification.class),
                eq(PageRequest.of(0, 10,
                        Sort.by("productId").descending())));
    }

    @Test
    void getAllFiltered_empty() {

        PageRequest pageable = PageRequest.of(
                0, 10, Sort.by("productId").descending());

        PageImpl<Product> page = new PageImpl<>(
                List.of(), pageable, 0);

        when(repository.findAll(
                any(Specification.class), any(Pageable.class)))
                .thenReturn(page);

        Map<String, Object> result =
                service.getAllFiltered(null, null, null, 1, 10);

        assertNotNull(result);
        @SuppressWarnings("unchecked")
        List<ProductResponse> data =
                (List<ProductResponse>) result.get("data");
        assertTrue(data.isEmpty());
        assertEquals(0L, result.get("total"));
        verify(productMaterialRepository, never())
                .findAllByProductProductIdIn(any());
        verify(productImageRepository, never())
                .findAllByProductProductIdIn(any());
    }

    // ==================== DELETE ====================

    @Test
    void delete_success() {

        when(repository.findById(1))
                .thenReturn(Optional.of(product));

        Boolean result = service.delete(1);

        assertTrue(result);
        ArgumentCaptor<Product> captor =
                ArgumentCaptor.forClass(Product.class);
        verify(repository).save(captor.capture());
        assertTrue(captor.getValue().getIsDeleted());
    }

    @Test
    void delete_notFound_returnsFalse() {

        when(repository.findById(99))
                .thenReturn(Optional.empty());

        Boolean result = service.delete(99);

        assertFalse(result);
        verify(repository, never()).save(any());
    }

    // ==================== COUNTPRODUCTS ====================

    @Test
    void countProducts_success() {

        when(repository.findAllWithCategory())
                .thenReturn(List.of(product));
        when(productMaterialRepository
                .findAllByProductProductIdIn(List.of(1)))
                .thenReturn(List.of());
        when(productImageRepository
                .findAllByProductProductIdIn(List.of(1)))
                .thenReturn(List.of());

        Integer result = service.countProducts();

        assertEquals(1, result);
    }
}
