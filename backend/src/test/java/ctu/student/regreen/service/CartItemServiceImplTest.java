package ctu.student.regreen.service;

import ctu.student.regreen.dto.request.CartItemRequest;
import ctu.student.regreen.dto.response.CartItemResponse;
import ctu.student.regreen.mapper.CartItemMapper;
import ctu.student.regreen.model.Cart;
import ctu.student.regreen.model.CartItem;
import ctu.student.regreen.model.CartItemId;
import ctu.student.regreen.model.Product;
import ctu.student.regreen.repository.CartItemRepository;
import ctu.student.regreen.repository.CartRepository;
import ctu.student.regreen.repository.ProductRepository;
import ctu.student.regreen.service.implement.CartItemServiceImpl;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartItemServiceImplTest {

    @Mock
    private CartItemRepository repository;

    @Mock
    private CartRepository cartRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CartItemMapper mapper;

    @InjectMocks
    private CartItemServiceImpl service;

    private Cart cart;
    private Product product;
    private CartItem item;

    private static final Integer CART_ID = 1;
    private static final Integer PRODUCT_ID = 10;
    private static final String USERNAME = "testuser";
    private static final Float PRODUCT_PRICE = 50_000f;
    private static final Integer INVENTORY = 10;

    @BeforeEach
    void setUp() {

        Authentication authentication =
                mock(Authentication.class);

        SecurityContext securityContext =
                mock(SecurityContext.class);

        when(authentication.getName())
                .thenReturn(USERNAME);

        when(securityContext.getAuthentication())
                .thenReturn(authentication);

        SecurityContextHolder.setContext(
                securityContext);

        cart = new Cart();
        cart.setCartId(CART_ID);

        product = new Product();
        product.setProductId(PRODUCT_ID);
        product.setProductName("Sản phẩm tái chế");
        product.setProductPrice(PRODUCT_PRICE);
        product.setInventory(INVENTORY);

        item = new CartItem();
        item.setId(new CartItemId(CART_ID, PRODUCT_ID));
        item.setCart(cart);
        item.setProduct(product);
        item.setQuantity(2);

        lenient()
                .when(cartRepository.findByCustomerUsername(USERNAME))
                .thenReturn(Optional.of(cart));
    }

    @AfterEach
    void tearDown() {

        SecurityContextHolder.clearContext();
    }

    private CartItemResponse cartItemResponse(
            Integer quantity) {

        return new CartItemResponse(
                CART_ID,
                PRODUCT_ID,
                "Sản phẩm tái chế",
                PRODUCT_PRICE,
                quantity,
                PRODUCT_PRICE * quantity);
    }

    // ==================== add ====================

    @Test
    void add_newItem_success() {

        CartItemRequest request = new CartItemRequest();
        request.setProductId(PRODUCT_ID);
        request.setQuantity(3);

        when(productRepository.findById(PRODUCT_ID))
                .thenReturn(Optional.of(product));

        when(repository.findById(any()))
                .thenReturn(Optional.empty());

        when(repository.save(any(CartItem.class)))
                .thenAnswer(i -> i.getArgument(0));

        when(mapper.toResponse(any(CartItem.class)))
                .thenReturn(cartItemResponse(3));

        CartItemResponse result =
                service.add(request);

        assertNotNull(result);
        assertEquals(3, result.getQuantity());
        assertEquals(CART_ID, result.getCartId());
        assertEquals(PRODUCT_ID, result.getProductId());

        verify(productRepository).findById(PRODUCT_ID);
        verify(repository).save(any(CartItem.class));
        verify(mapper).toResponse(any(CartItem.class));
    }

    @Test
    void add_existingItem_success() {

        CartItemRequest request = new CartItemRequest();
        request.setProductId(PRODUCT_ID);
        request.setQuantity(3);

        when(productRepository.findById(PRODUCT_ID))
                .thenReturn(Optional.of(product));

        when(repository.findById(any()))
                .thenReturn(Optional.of(item));

        when(repository.save(any(CartItem.class)))
                .thenAnswer(i -> i.getArgument(0));

        when(mapper.toResponse(any(CartItem.class)))
                .thenReturn(cartItemResponse(5));

        CartItemResponse result =
                service.add(request);

        assertNotNull(result);

        verify(productRepository).findById(PRODUCT_ID);
        verify(repository).save(any(CartItem.class));
        verify(mapper).toResponse(any(CartItem.class));
    }

    @Test
    void add_quantityZero_throwsException() {

        CartItemRequest request = new CartItemRequest();
        request.setProductId(PRODUCT_ID);
        request.setQuantity(0);

        when(productRepository.findById(PRODUCT_ID))
                .thenReturn(Optional.of(product));

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.add(request));

        assertEquals(
                "Quantity must be greater than 0",
                ex.getMessage());

        verify(repository, never()).save(any());
    }

    @Test
    void add_quantityNegative_throwsException() {

        CartItemRequest request = new CartItemRequest();
        request.setProductId(PRODUCT_ID);
        request.setQuantity(-1);

        when(productRepository.findById(PRODUCT_ID))
                .thenReturn(Optional.of(product));

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.add(request));

        assertEquals(
                "Quantity must be greater than 0",
                ex.getMessage());

        verify(repository, never()).save(any());
    }

    @Test
    void add_newItem_insufficientInventory_throwsException() {

        CartItemRequest request = new CartItemRequest();
        request.setProductId(PRODUCT_ID);
        request.setQuantity(5);

        product.setInventory(2);

        when(productRepository.findById(PRODUCT_ID))
                .thenReturn(Optional.of(product));

        when(repository.findById(any()))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.add(request));

        assertEquals(
                "Not enough stock. Available: 2",
                ex.getMessage());

        verify(repository, never()).save(any());
    }

    @Test
    void add_existingItem_insufficientInventory_throwsException() {

        CartItemRequest request = new CartItemRequest();
        request.setProductId(PRODUCT_ID);
        request.setQuantity(5);

        item.setQuantity(8);

        when(productRepository.findById(PRODUCT_ID))
                .thenReturn(Optional.of(product));

        when(repository.findById(any()))
                .thenReturn(Optional.of(item));

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.add(request));

        assertEquals(
                "Not enough stock. Available: 10",
                ex.getMessage());

        verify(repository, never()).save(any());
    }

    @Test
    void add_productNotFound_throwsException() {

        CartItemRequest request = new CartItemRequest();
        request.setProductId(PRODUCT_ID);
        request.setQuantity(1);

        when(productRepository.findById(PRODUCT_ID))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.add(request));

        assertEquals("Product not found", ex.getMessage());

        verify(repository, never()).save(any());
    }

    @Test
    void add_cartNotFound_throwsException() {

        CartItemRequest request = new CartItemRequest();
        request.setProductId(PRODUCT_ID);
        request.setQuantity(1);

        when(cartRepository.findByCustomerUsername(USERNAME))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.add(request));

        assertEquals("Cart not found", ex.getMessage());

        verify(repository, never()).save(any());
    }

    // ==================== getMyCartItems ====================

    @Test
    void getMyCartItems_success() {

        CartItemResponse resp = cartItemResponse(2);

        when(repository.findByCartCartIdWithProduct(CART_ID))
                .thenReturn(List.of(item));

        when(mapper.toResponse(item))
                .thenReturn(resp);

        List<CartItemResponse> result =
                service.getMyCartItems();

        assertEquals(1, result.size());
        assertEquals(PRODUCT_ID, result.get(0).getProductId());
        assertEquals(2, result.get(0).getQuantity());

        verify(repository).findByCartCartIdWithProduct(CART_ID);
        verify(mapper).toResponse(item);
    }

    @Test
    void getMyCartItems_empty_returnsEmptyList() {

        when(repository.findByCartCartIdWithProduct(CART_ID))
                .thenReturn(Collections.emptyList());

        List<CartItemResponse> result =
                service.getMyCartItems();

        assertTrue(result.isEmpty());
        verify(mapper, never()).toResponse(any());
    }

    @Test
    void getMyCartItems_cartNotFound_throwsException() {

        when(cartRepository.findByCustomerUsername(USERNAME))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.getMyCartItems());

        assertEquals("Cart not found", ex.getMessage());
    }

    // ==================== update ====================

    @Test
    void update_success() {

        when(repository.findById(any()))
                .thenReturn(Optional.of(item));

        when(repository.save(any(CartItem.class)))
                .thenAnswer(i -> i.getArgument(0));

        when(mapper.toResponse(any(CartItem.class)))
                .thenReturn(cartItemResponse(7));

        CartItemResponse result =
                service.update(PRODUCT_ID, 7);

        assertNotNull(result);
        assertEquals(7, result.getQuantity());

        verify(repository).findById(any());
        verify(repository).save(any(CartItem.class));
        verify(mapper).toResponse(any(CartItem.class));
    }

    @Test
    void update_itemNotFound_throwsException() {

        when(repository.findById(any()))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.update(PRODUCT_ID, 5));

        assertEquals("Cart item not found", ex.getMessage());

        verify(repository, never()).save(any());
    }

    @Test
    void update_cartNotFound_throwsException() {

        when(cartRepository.findByCustomerUsername(USERNAME))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.update(PRODUCT_ID, 5));

        assertEquals("Cart not found", ex.getMessage());
    }

    // ==================== delete ====================

    @Test
    void delete_success() {

        when(repository.findById(any()))
                .thenReturn(Optional.of(item));

        service.delete(PRODUCT_ID);

        verify(repository).findById(any());
        verify(repository).delete(item);
    }

    @Test
    void delete_itemNotFound_throwsException() {

        when(repository.findById(any()))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.delete(PRODUCT_ID));

        assertEquals("Cart item not found", ex.getMessage());

        verify(repository, never()).delete(any());
    }

    @Test
    void delete_cartNotFound_throwsException() {

        when(cartRepository.findByCustomerUsername(USERNAME))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> service.delete(PRODUCT_ID));

        assertEquals("Cart not found", ex.getMessage());
    }
}
