// package ctu.student.regreen.service;

// import ctu.student.regreen.dto.request.ProductRequest;
// import ctu.student.regreen.dto.response.ProductResponse;
// import ctu.student.regreen.mapper.ProductMapper;
// import ctu.student.regreen.model.Category;
// import ctu.student.regreen.model.File;
// import ctu.student.regreen.model.Product;
// import ctu.student.regreen.repository.CategoryRepository;
// import ctu.student.regreen.repository.FileRepository;
// import ctu.student.regreen.repository.ProductRepository;
// import ctu.student.regreen.service.implement.ProductServiceImpl;

// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;

// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.junit.jupiter.MockitoExtension;

// import java.util.List;
// import java.util.Optional;

// import static org.junit.jupiter.api.Assertions.*;
// import static org.mockito.Mockito.*;

// @ExtendWith(MockitoExtension.class)
// class ProductServiceImplTest {

//     @Mock
//     private ProductRepository repository;

//     @Mock
//     private CategoryRepository categoryRepository;

//     @Mock
//     private FileRepository fileRepository;

//     @Mock
//     private ProductMapper mapper;

//     @InjectMocks
//     private ProductServiceImpl service;

//     private Product product;

//     private ProductRequest request;

//     private ProductResponse response;

//     private Category category;

//     private File file;

//     @BeforeEach
//     void setUp() {

//         product = new Product();
//         product.setProductId(1);

//         category = new Category();

//         file = new File();

//         request = new ProductRequest();

//         request.setCategoryId(1);

//         response =
//                 mock(ProductResponse.class);

//         lenient()
//                 .when(mapper.toResponse(any()))
//                 .thenReturn(response);
//     }

//     @Test
//     void create_success() {

//         when(categoryRepository.findById(1))
//                 .thenReturn(Optional.of(category));

//         when(fileRepository.findById(1))
//                 .thenReturn(Optional.of(file));

//         when(mapper.toEntity(
//                 request,
//                 category,
//                 file))
//                 .thenReturn(product);

//         when(repository.save(product))
//                 .thenReturn(product);

//         ProductResponse result =
//                 service.create(request);

//         assertNotNull(result);

//         verify(repository)
//                 .save(product);
//     }

//     @Test
//     void create_categoryNotFound_fail() {

//         when(categoryRepository.findById(1))
//                 .thenReturn(Optional.empty());

//         RuntimeException ex =
//                 assertThrows(
//                         RuntimeException.class,
//                         () -> service.create(request));

//         assertEquals(
//                 "Category not found",
//                 ex.getMessage());
//     }

//     @Test
//     void create_fileNotFound_fail() {

//         when(categoryRepository.findById(1))
//                 .thenReturn(Optional.of(category));

//         when(fileRepository.findById(1))
//                 .thenReturn(Optional.empty());

//         RuntimeException ex =
//                 assertThrows(
//                         RuntimeException.class,
//                         () -> service.create(request));

//         assertEquals(
//                 "File not found",
//                 ex.getMessage());
//     }

//     @Test
//     void update_success() {

//         when(repository.findById(1))
//                 .thenReturn(Optional.of(product));

//         when(categoryRepository.findById(1))
//                 .thenReturn(Optional.of(category));

//         when(fileRepository.findById(1))
//                 .thenReturn(Optional.of(file));

//         ProductResponse result =
//                 service.update(
//                         1,
//                         request);

//         assertNotNull(result);

//         verify(mapper)
//                 .update(
//                         product,
//                         request,
//                         category,
//                         file);
//     }

//     @Test
//     void update_productNotFound_fail() {

//         when(repository.findById(1))
//                 .thenReturn(Optional.empty());

//         RuntimeException ex =
//                 assertThrows(
//                         RuntimeException.class,
//                         () -> service.update(
//                                 1,
//                                 request));

//         assertEquals(
//                 "Product not found",
//                 ex.getMessage());
//     }

//     @Test
//     void update_categoryNotFound_fail() {

//         when(repository.findById(1))
//                 .thenReturn(Optional.of(product));

//         when(categoryRepository.findById(1))
//                 .thenReturn(Optional.empty());

//         RuntimeException ex =
//                 assertThrows(
//                         RuntimeException.class,
//                         () -> service.update(
//                                 1,
//                                 request));

//         assertEquals(
//                 "Category not found",
//                 ex.getMessage());
//     }

//     @Test
//     void update_fileNotFound_fail() {

//         when(repository.findById(1))
//                 .thenReturn(Optional.of(product));

//         when(categoryRepository.findById(1))
//                 .thenReturn(Optional.of(category));

//         when(fileRepository.findById(1))
//                 .thenReturn(Optional.empty());

//         RuntimeException ex =
//                 assertThrows(
//                         RuntimeException.class,
//                         () -> service.update(
//                                 1,
//                                 request));

//         assertEquals(
//                 "File not found",
//                 ex.getMessage());
//     }

//     @Test
//     void getById_success() {

//         when(repository.findById(1))
//                 .thenReturn(Optional.of(product));

//         ProductResponse result =
//                 service.getById(1);

//         assertNotNull(result);
//     }

//     @Test
//     void getById_notFound_fail() {

//         when(repository.findById(1))
//                 .thenReturn(Optional.empty());

//         RuntimeException ex =
//                 assertThrows(
//                         RuntimeException.class,
//                         () -> service.getById(1));

//         assertEquals(
//                 "Product not found",
//                 ex.getMessage());
//     }

//     @Test
//     void getAll_success() {

//         when(repository.findAll())
//                 .thenReturn(
//                         List.of(product));

//         List<ProductResponse> result =
//                 service.getAll();

//         assertEquals(
//                 1,
//                 result.size());
//     }

//     @Test
//     void delete_success() {

//         when(repository.findById(1))
//                 .thenReturn(Optional.of(product));

//         service.delete(1);

//         verify(repository)
//                 .delete(product);
//     }

//     @Test
//     void delete_notFound_fail() {

//         when(repository.findById(1))
//                 .thenReturn(Optional.empty());

//         RuntimeException ex =
//                 assertThrows(
//                         RuntimeException.class,
//                         () -> service.delete(1));

//         assertEquals(
//                 "Product not found",
//                 ex.getMessage());
//     }
// }